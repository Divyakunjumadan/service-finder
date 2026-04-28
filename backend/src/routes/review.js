const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { createReview, getVendorReviews } = require('../controllers/reviewController');

router.post('/', protect, authorize('user'), createReview);
router.get('/vendor/:id', getVendorReviews);

module.exports = router;
