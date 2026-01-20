const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// GET /api/analytics/dashboard
router.get('/dashboard', async (req, res) => {
    try {
        // 1. Category Revenue Distribution
        const revenueByCat = await Product.aggregate([
            {
                $group: {
                    _id: "$category", 
                    totalRevenue: { $sum: "$price" },
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            { $unwind: "$categoryDetails" },
            {
                $project: {
                    name: "$categoryDetails.name",
                    value: "$totalRevenue"
                }
            }
        ]);

        // 2. Top Selling Products (Sorted by Price for now)
        const topProducts = await Product.find()
            .sort({ price: -1 })
            .limit(5)
            .populate('category', 'name');

        // 3. Recent Activity (Latest products added)
        const recentActivity = await Product.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('category', 'name');

        res.json({ revenueByCat, topProducts, recentActivity });
    } catch (err) {
        console.error("Analytics Error:", err);
        res.status(500).json({ message: "Server Error fetching analytics" });
    }
});

module.exports = router;