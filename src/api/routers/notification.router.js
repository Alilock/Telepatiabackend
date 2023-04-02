const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

// GET /api/notifications/:userId
router.get('/:userId', notificationController.getNotifications);

// PUT /api/notifications/:notificationId
router.put('/:notificationId', notificationController.markAsRead);

module.exports = router;