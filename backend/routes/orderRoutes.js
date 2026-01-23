const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product'); // ✅ IMPORTANT: Add this import

// POST: Save successful order from checkout
router.post('/success', async (req, res) => {
  try {
    console.log("📦 Order Creation Request Body:", JSON.stringify(req.body, null, 2));
    
    const { userId, items, totalAmount, sessionId } = req.body;

    // Validation with detailed logging
    if (!userId) {
      console.error("❌ Missing userId");
      return res.status(400).json({ message: "Missing userId" });
    }
    
    if (!items || items.length === 0) {
      console.error("❌ Missing or empty items array");
      return res.status(400).json({ message: "Missing or empty items" });
    }

    console.log("✅ Validation passed. Processing items...");

    const orderItems = items.map((item, index) => {
      console.log(`  Item ${index}:`, {
        name: item.name,
        category: item.category,
        productId: item.productId,
        qty: item.qty,
        price: item.price
      });
      
      return {
        name: item.name,
        category: item.category || "Uncategorized",
        qty: item.qty,
        price: item.price,
        image: item.image,
        product: item.productId  // This should be the MongoDB ObjectId
      };
    });

    // ✅ STOCK VALIDATION - Check if all products have enough stock
    console.log("🔍 Checking stock availability...");
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        console.error(`❌ Product not found: ${item.product}`);
        return res.status(404).json({ 
          message: `Product "${item.name}" not found in database` 
        });
      }
      
      if (product.stock < item.qty) {
        console.error(`❌ Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.qty}`);
        return res.status(400).json({ 
          message: `Insufficient stock for "${product.name}". Only ${product.stock} available.` 
        });
      }
      
      console.log(`  ✅ Stock check passed for ${product.name}: ${product.stock} available, ${item.qty} requested`);
    }

    console.log("📝 Creating order with items:", orderItems);

    const newOrder = new Order({
      user: userId,
      orderItems,
      totalAmount: parseFloat(totalAmount),
      paymentStatus: 'Paid',
      stripeSessionId: sessionId
    });

    console.log("💾 Saving order...");
    await newOrder.save();
    
    // ✅ DECREASE STOCK - Update product stock after order is saved
    console.log("📉 Updating product stock...");
    for (const item of orderItems) {
      const updatedProduct = await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.qty } }, // Decrease stock by quantity ordered
        { new: true } // Return the updated document
      );
      
      if (updatedProduct) {
        console.log(`  ✅ Decreased stock for "${item.name}" by ${item.qty}. New stock: ${updatedProduct.stock}`);
      } else {
        console.error(`  ⚠️ Could not update stock for product ${item.product}`);
      }
    }
    
    console.log("✅ Order saved successfully:", newOrder._id);
    console.log("✅ Stock updated for all products");
    
    res.status(201).json({ 
      message: "Order recorded and stock updated", 
      order: newOrder 
    });
    
  } catch (err) {
    console.error("❌ Order Save Error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ 
      message: "Error saving order", 
      error: err.message 
    });
  }
});

// GET: all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'username email');
    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

module.exports = router;