const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { updateProfile, getNotifications, markNotificationsRead, getUnreadCount } = require('../controllers/userController');

router.patch('/profile', protect, authorize('user'), updateProfile);
router.get('/notifications', protect, getNotifications);
router.patch('/notifications/read', protect, markNotificationsRead);
router.get('/notifications/unread-count', protect, getUnreadCount);

module.exports = router;
