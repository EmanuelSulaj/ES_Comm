const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');

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
        category: item.category?.name || item.category,
        productId: item.productId || item._id || item.product,
        qty: item.qty || item.quantity,
        price: item.price
      });
      
      return {
        name: item.name,
        category: item.category?.name || item.category || "Uncategorized",
        qty: item.qty || item.quantity,
        price: item.price,
        image: item.image,
        product: item.productId || item._id || item.product
      };
    });

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
    
    console.log("✅ Order saved successfully:", newOrder._id);
    
    res.status(201).json({ message: "Order recorded", order: newOrder });
  } catch (err) {
    console.error("❌ Order Save Error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ message: "Error saving order", error: err.message });
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