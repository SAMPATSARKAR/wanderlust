const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { listingId, checkIn, checkOut, guests, specialRequests } = req.body;

    if (!listingId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Please provide listing ID, check-in date, and check-out date.'
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found.'
      });
    }

    // Prevent owner from booking their own listing
    if (listing.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Property owners cannot book their own property.'
      });
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date.'
      });
    }

    const diffTime = Math.abs(endDate - startDate);
    const totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (totalNights < 1) {
      return res.status(400).json({
        success: false,
        message: 'Reservation must be for at least 1 night.'
      });
    }

    const totalPrice = totalNights * listing.price;

    const booking = await Booking.create({
      listing: listingId,
      renter: req.user._id,
      checkIn: startDate,
      checkOut: endDate,
      guests: Number(guests) || 1,
      totalNights,
      pricePerNight: listing.price,
      totalPrice,
      specialRequests: specialRequests || ''
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('listing', 'title image location country price')
      .populate('renter', 'name email');

    res.status(201).json({
      success: true,
      message: 'Reservation confirmed successfully!',
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings made by currently authenticated renter
// @route   GET /api/bookings/my-trips
// @access  Private
exports.getMyTrips = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ renter: req.user._id })
      .populate('listing', 'title image location country price owner')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reservations on listings owned by currently authenticated owner
// @route   GET /api/bookings/owner-reservations
// @access  Private (Owner, Admin)
exports.getOwnerReservations = async (req, res, next) => {
  try {
    // Find all listings owned by current user
    const ownerListings = await Listing.find({ owner: req.user._id }).select('_id');
    const listingIds = ownerListings.map((l) => l._id);

    const reservations = await Booking.find({ listing: { $in: listingIds } })
      .populate('listing', 'title image location')
      .populate('renter', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private (Renter who booked or Listing Owner/Admin)
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('listing');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    const isRenter = booking.renter.toString() === req.user._id.toString();
    const isOwner = booking.listing && booking.listing.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isRenter && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to cancel this booking.'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully.',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private (Owner, Admin)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Choose from: confirmed, cancelled, completed.'
      });
    }

    const booking = await Booking.findById(req.params.id).populate('listing');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    const isOwner = booking.listing && booking.listing.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only the property owner or admin can update status.'
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}.`,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};
