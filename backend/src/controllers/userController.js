const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc  Update user profile
// @route PATCH /api/users/profile
// @access Private (user)
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, location } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (location !== undefined) user.location = location;

    await user.save();
    res.status(200).json({ success: true, message: 'Profile updated.', user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get user notifications
// @route GET /api/users/notifications
// @access Private (user)
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Mark all notifications as read
// @route PATCH /api/users/notifications/read
// @access Private (user)
const markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: 'Notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get unread notification count
// @route GET /api/users/notifications/unread-count
// @access Private (user)
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ userId: req.user._id, isRead: false });
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { updateProfile, getNotifications, markNotificationsRead, getUnreadCount };
