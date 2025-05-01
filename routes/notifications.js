const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// Get all notifications
router.get('/', protect, notificationController.getNotifications);

// Mark a notification as read
router.put('/:id/read', protect, notificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', protect, notificationController.markAllAsRead);

// Delete a notification
router.delete('/:id', protect, notificationController.deleteNotification);

module.exports = router; 