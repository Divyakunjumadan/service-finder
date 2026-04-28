const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const {
  createRequest,
  getUserRequests,
  getVendorRequests,
  updateRequestStatus,
  getRequestById
} = require('../controllers/requestController');

router.post('/', protect, authorize('user'), createRequest);
router.get('/user', protect, authorize('user'), getUserRequests);
router.get('/vendor', protect, authorize('vendor'), getVendorRequests);
router.get('/:id', protect, getRequestById);
router.patch('/:id', protect, authorize('vendor'), updateRequestStatus);

module.exports = router;
