const Review = require('../models/Review');
const Listing = require('../models/Listing');

// Helper to recalculate listing rating and count
const updateListingRating = async (listingId) => {
  const reviews = await Review.find({ listing: listingId });
  const reviewCount = reviews.length;
  let rating = 4.8;

  if (reviewCount > 0) {
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    rating = parseFloat((sum / reviewCount).toFixed(1));
  }

  await Listing.findByIdAndUpdate(listingId, { rating, reviewCount });
};

// @desc    Add review to listing
// @route   POST /api/listings/:listingId/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { listingId } = req.params;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both rating and comment.'
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found.'
      });
    }

    const review = await Review.create({
      listing: listingId,
      author: req.user._id,
      rating: Number(rating),
      comment
    });

    await updateListingRating(listingId);

    const populatedReview = await Review.findById(review._id).populate(
      'author',
      'name avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Review added successfully.',
      data: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/listings/:listingId/reviews/:reviewId
// @access  Private (Author of review or Admin)
exports.deleteReview = async (req, res, next) => {
  try {
    const { listingId, reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.'
      });
    }

    const isAuthor = review.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own reviews.'
      });
    }

    await review.deleteOne();
    await updateListingRating(listingId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a listing
// @route   GET /api/listings/:listingId/reviews
// @access  Public
exports.getListingReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};
