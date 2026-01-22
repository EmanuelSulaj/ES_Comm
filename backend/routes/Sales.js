const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category'); 
const Order = require('../models/Order');
const User = require('../models/User');

router.get('/dashboard', async (req, res) => {
    try {
        const [revenueByCat, topProducts, recentActivity, recentPurchases] = await Promise.all([
            // 1. Inventory Value by Category
            Product.aggregate([
                { $group: { _id: "$category", totalRevenue: { $sum: "$price" } } },
                { $sort: { totalRevenue: -1 } },
                { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "cat" } },
                { $unwind: "$cat" },
                { $project: { name: "$cat.name", value: "$totalRevenue" } }
            ]),

            // 2. Premium Products (highest priced - for Analytics Page)
            Product.find()
                .populate('category', 'name')
                .sort({ price: -1 })
                .limit(5)
                .select('name price category'),

            // 3. Recent Activity (recently added products)
            Product.find()
                .populate('category', 'name')
                .sort({ createdAt: -1 })
                .limit(5)
                .select('name price category'),

            // 4. Recent Purchases
            Order.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('user', 'username')
                .select('totalAmount user')
        ]);

        res.json({ 
            revenueByCat, 
            topProducts,
            recentActivity,
            recentPurchases 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/admin/top-products - Top selling products
router.get('/top-products', async (req, res) => {
    try {
        const topProducts = await Order.aggregate([
            { $unwind: "$items" },
            { 
                $group: { 
                    _id: "$items.product", 
                    sold: { $sum: "$items.quantity" },
                    revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } 
                }
            },
            { $sort: { sold: -1 } },
            { $limit: 5 },
            { 
                $lookup: { 
                    from: "products", 
                    localField: "_id", 
                    foreignField: "_id", 
                    as: "productInfo" 
                } 
            },
            { $unwind: "$productInfo" },
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
                $project: { 
                    _id: "$productInfo._id",
                    name: "$productInfo.name", 
                    sold: 1, 
                    revenue: 1,
                    price: "$productInfo.price",
                    categoryName: "$categoryInfo.name",  // Changed from 'category' to 'categoryName'
                    image: "$productInfo.image"
                } 
            }
        ]);

        console.log("📦 Top Products Response:", topProducts); // Add for debugging

        res.json(topProducts);
    } catch (err) {
        console.error('Top products error:', err);
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;