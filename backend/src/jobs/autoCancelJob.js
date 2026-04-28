const cron = require('node-cron');
const Request = require('../models/Request');
const Vendor = require('../models/Vendor');
const Notification = require('../models/Notification');
const User = require('../models/User');

const autoCancelJob = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

      // Find all pending requests older than 15 minutes
      const expiredRequests = await Request.find({
        status: 'pending',
        createdAt: { $lt: fifteenMinutesAgo }
      }).populate('vendorId', 'ownerId shopName');

      if (expiredRequests.length === 0) return;

      const requestIds = expiredRequests.map((r) => r._id);

      // Bulk update to auto-cancelled
      await Request.updateMany(
        { _id: { $in: requestIds } },
        { $set: { status: 'auto-cancelled' } }
      );

      // Create notifications for users and vendors
      const notifications = [];
      for (const request of expiredRequests) {
        // Notify user
        notifications.push({
          userId: request.userId,
          message: `Your service request has been auto-cancelled (no response within 15 minutes).`,
          type: 'status',
          requestId: request._id
        });

        // Notify vendor
        if (request.vendorId && request.vendorId.ownerId) {
          notifications.push({
            userId: request.vendorId.ownerId,
            message: `A service request was auto-cancelled due to no response from your side.`,
            type: 'system',
            requestId: request._id
          });
        }
      }

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }

      console.log(
        `⏱ Auto-cancelled ${expiredRequests.length} request(s) at ${new Date().toLocaleTimeString()}`
      );
    } catch (error) {
      console.error('❌ Auto-cancel job error:', error.message);
    }
  });

  console.log('⏰ Auto-cancel cron job started (runs every minute)');
};

module.exports = autoCancelJob;
