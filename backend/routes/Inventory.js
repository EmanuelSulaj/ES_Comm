const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


router.patch('/:id/adjust', async (req, res) => {
  try {
    const { amount, stock } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (amount !== undefined) {
      product.stock = Math.max(0, (product.stock || 0) + amount);
    } else if (stock !== undefined) {
      product.stock = stock;
    } else {
      return res.status(400).json({ message: 'No stock data provided' });
    }

    await product.save();
    res.json({ message: 'Stock updated', stock: product.stock });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
