const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const Product = require('../models/Product');

// GET: Get user's favorites
router.get('/:userId', async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.params.userId })
      .populate({
        path: 'product',
        populate: { path: 'category', select: 'name' }
      })
      .sort({ createdAt: -1 });
    
    res.json(favorites);
  } catch (error) {
    console.error("Fetch favorites error:", error);
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
});

// POST: Add product to favorites
router.post('/', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ user: userId, product: productId });
    if (existingFavorite) {
      return res.status(400).json({ message: "Product already in favorites" });
    }

    const favorite = new Favorite({
      user: userId,
      product: productId
    });

    await favorite.save();
    await favorite.populate({
      path: 'product',
      populate: { path: 'category', select: 'name' }
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error("Add favorite error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Product already in favorites" });
    }
    res.status(500).json({ message: "Failed to add favorite" });
  }
});

// DELETE: Remove product from favorites
router.delete('/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    const favorite = await Favorite.findOneAndDelete({ user: userId, product: productId });
    
    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.error("Remove favorite error:", error);
    res.status(500).json({ message: "Failed to remove favorite" });
  }
});

// GET: Check if product is favorited by user
router.get('/check/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    const favorite = await Favorite.findOne({ user: userId, product: productId });
    
    res.json({ isFavorited: !!favorite });
  } catch (error) {
    console.error("Check favorite error:", error);
    res.status(500).json({ message: "Failed to check favorite" });
  }
});

module.exports = router;

