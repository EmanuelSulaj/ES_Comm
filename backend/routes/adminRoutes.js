const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// GET: Customers report
router.get('/customers-report', async (req, res) => {
  try {
    const customers = await Order.aggregate([
      
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalAmount' },            
          orderCount: { $sum: 1 },                       
          totalProducts: { $sum: { $sum: '$orderItems.qty' } }, 
          lastPurchase: { $max: '$createdAt' }            
        }
      },
      
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }

      },
      
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
      
      {
        $project: {
          username: { $ifNull: ['$userDetails.username', 'Unknown User'] },
          email: { $ifNull: ['$userDetails.email', 'No Email'] },
          totalSpent: 1,
          orderCount: 1,
          totalProducts: 1,
          lastPurchase: 1
        }
      },
      
      { $sort: { totalSpent: -1 } }
    ]);

    res.json(customers);
  } catch (error) {
    console.error("Customer report error:", error);
    res.status(500).json({ message: "Failed to generate report" });
  }
});


router.get('/dashboard-stats', async (req, res) => {
  try {
    console.log("📊 Fetching Dashboard Stats...");

    // 1. Get Sales Data
    const salesData = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } }
    ]);

    // 2. Get counts individually with fail-safes
    const customers = await User.countDocuments({ role: 'user' }).catch(e => {
        console.error("User Count Error:", e.message);
        return 0;
    });

    const orders = await Order.countDocuments().catch(e => {
        console.error("Order Count Error:", e.message);
        return 0;
    });

    const products = await Product.countDocuments().catch(e => {
        console.error("Product Count Error (Is the model imported?):", e.message);
        return 0;
    });

    const result = {
      totalSales: salesData[0]?.totalSales || 0,
      customers,
      orders,
      products
    };

    console.log("✅ Stats compiled:", result);
    res.json(result);

  } catch (error) {
    console.error("❌ CRITICAL DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Server Error", details: error.message });
  }
});


router.get('/sales-trend', async (req, res) => {
  try {
    const trend = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }, 
      { $limit: 30 } 
    ]);

 
    const formattedData = trend.map(item => ({
      date: item._id,
      revenue: item.revenue,
      orders: item.orderCount
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/category-distribution', async (req, res) => {
  try {
    const distribution = await Order.aggregate([
      // 0. ONLY count paid orders
      { $match: { paymentStatus: "Paid" } },
      
      // 1. Break order items
      { $unwind: "$orderItems" },

      // 2. Join product (STRICT ObjectId match)
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "product"
        }
      },

      // 3. Remove items without product
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: false } },

      // 4. Join category
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "category"
        }
      },

      // 5. Remove items without category
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: false } },

      // 6. Group by category name
      {
        $group: {
          _id: "$category.name",
          value: {
            $sum: {
              $multiply: ["$orderItems.qty", "$orderItems.price"]
            }
          }
        }
      },

      // 7. Shape for frontend
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: 1
        }
      },
      
      // 8. Sort by value descending
      { $sort: { value: -1 } }
    ]);

    console.log("📊 Category Distribution Result:", distribution);
    res.json(distribution);
  } catch (err) {
    console.error("Category distribution error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/top-products', async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $unwind: "$orderItems" },
      
      // Lookup the product
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
      
      // Lookup the category from product
      {
        $lookup: {
          from: "categories",
          localField: "productInfo.category",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },

      {
        $group: {
          _id: "$orderItems.product",
          name: { $first: "$orderItems.name" },
          // Use category from lookup instead of orderItems
          category: { 
            $first: { 
              $ifNull: [
                "$categoryInfo.name",           // Try from lookup
                "$orderItems.category",         // Fallback to stored category
                "Uncategorized"                 // Final fallback
              ] 
            } 
          },
          totalSold: { $sum: "$orderItems.qty" },
          revenue: {
            $sum: {
              $multiply: ["$orderItems.qty", "$orderItems.price"]
            }
          }
        }
      },

      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    console.log("📊 Top Products (with category lookup):", topProducts);
    res.json(topProducts);
  } catch (err) {
    console.error("Top products error:", err);
    res.status(500).json({ message: "Failed to fetch top products", error: err.message });
  }
});

router.get('/low-stock-products', async (req, res) => {
  try {
    const Product = require('../models/Product');
    
    const lowStockProducts = await Product.find({
      stock: { $lt: 10 } // Products with less than 10 items
    })
    .populate('category', 'name')
    .sort({ stock: 1 }) // Sort by lowest stock first
    .limit(5);
    
    const formatted = lowStockProducts.map(p => ({
      name: p.name,
      category: p.category?.name || 'Uncategorized',
      stock: p.stock,
      price: p.price
    }));
    
    res.json(formatted);
  } catch (err) {
    console.error('Low stock error:', err);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;





