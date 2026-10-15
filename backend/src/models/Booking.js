const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    checkIn: {
      type: Date,
      required: [true, 'Please provide check-in date']
    },
    checkOut: {
      type: Date,
      required: [true, 'Please provide check-out date']
    },
    guests: {
      type: Number,
      required: true,
      default: 1,
      min: 1
    },
    totalNights: {
      type: Number,
      required: true,
      min: 1
    },
    pricePerNight: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed'
    },
    specialRequests: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
