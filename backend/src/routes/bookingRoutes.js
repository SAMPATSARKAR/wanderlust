const express = require('express');
const {
  createBooking,
  getMyTrips,
  getOwnerReservations,
  cancelBooking,
  updateBookingStatus
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authorize');

const router = express.Router();

router.use(protect); // All booking routes require authentication

router.post('/', createBooking);
router.get('/my-trips', getMyTrips);
router.get(
  '/owner-reservations',
  authorizeRoles('owner', 'admin'),
  getOwnerReservations
);
router.patch('/:id/cancel', cancelBooking);
router.patch('/:id/status', authorizeRoles('owner', 'admin'), updateBookingStatus);

module.exports = router;
