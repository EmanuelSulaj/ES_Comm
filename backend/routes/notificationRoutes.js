const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const Order = require('../models/Order');

// GET: Get all notifications (most recent first)
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('orderId', 'totalAmount createdAt')
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(100); 
    
    res.json(notifications);
  } catch (error) {
    console.error("Fetch notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// GET: Get unread notifications count
router.get('/unread-count', async (req, res) => {
  try {
    const count = await Notification.countDocuments({ isRead: false });
    res.json({ count });
  } catch (error) {
    console.error("Fetch unread count error:", error);
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
});

// POST: Create a new notification
router.post('/', async (req, res) => {
  try {
    const { type, title, message, orderId, userId } = req.body;
    
    const notification = new Notification({
      type: type || 'order',
      title,
      message,
      orderId: orderId || null,
      userId: userId || null
    });
    
    await notification.save();
    
    // Populate before sending
    await notification.populate('orderId', 'totalAmount createdAt');
    await notification.populate('userId', 'username email');
    
    res.status(201).json(notification);
  } catch (error) {
    console.error("Create notification error:", error);
    res.status(500).json({ message: "Failed to create notification" });
  }
});

// PUT: Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    res.json(notification);
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
});

// PUT: Mark all notifications as read
router.put('/mark-all-read', async (req, res) => {
  try {
    await Notification.updateMany(
      { isRead: false },
      { isRead: true }
    );
    
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res.status(500).json({ message: "Failed to mark all notifications as read" });
  }
});

module.exports = router;

