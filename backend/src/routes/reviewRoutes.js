const express = require('express');
const {
  addReview,
  deleteReview,
  getListingReviews
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getListingReviews)
  .post(protect, addReview);

router
  .route('/:reviewId')
  .delete(protect, deleteReview);

module.exports = router;
