const express = require('express');
const {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
  getCategories,
  getFeaturedListings
} = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');
const {
  authorizeRoles,
  authorizeListingOwner
} = require('../middleware/authorize');
const reviewRoutes = require('./reviewRoutes');

const router = express.Router();

// Nested reviews router: /api/listings/:listingId/reviews
router.use('/:listingId/reviews', reviewRoutes);

// Meta routes
router.get('/meta/categories', getCategories);
router.get('/meta/featured', getFeaturedListings);

// Owner protected management routes
router.get(
  '/owner/my-listings',
  protect,
  authorizeRoles('owner', 'admin'),
  getMyListings
);

// General listings routes
router
  .route('/')
  .get(getAllListings)
  .post(protect, authorizeRoles('owner', 'admin'), createListing);

router
  .route('/:id')
  .get(getListingById)
  .put(protect, authorizeRoles('owner', 'admin'), authorizeListingOwner, updateListing)
  .delete(protect, authorizeRoles('owner', 'admin'), authorizeListingOwner, deleteListing);

module.exports = router;
