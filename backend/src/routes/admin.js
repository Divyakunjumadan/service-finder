const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const {
  getAnalytics,
  getAllUsers,
  toggleBlockUser,
  getAllVendors,
  toggleApproveVendor,
  deleteVendor,
  getAllRequests,
  getAllReviews
} = require('../controllers/adminController');

router.use(protect, authorize('admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.patch('/users/:id/block', toggleBlockUser);
router.get('/vendors', getAllVendors);
router.patch('/vendors/:id/approve', toggleApproveVendor);
router.delete('/vendors/:id', deleteVendor);
router.get('/requests', getAllRequests);
router.get('/reviews', getAllReviews);

module.exports = router;
