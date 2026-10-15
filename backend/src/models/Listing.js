const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a property description']
    },
    image: {
      type: String,
      required: [true, 'Please provide a primary image URL']
    },
    gallery: {
      type: [String],
      default: []
    },
    price: {
      type: Number,
      required: [true, 'Please provide price per night'],
      min: [10, 'Price must be at least $10']
    },
    location: {
      type: String,
      required: [true, 'Please provide a location/city'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Please provide a country'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Trending',
        'Cabins',
        'Beachfront',
        'Iconic Cities',
        'Lakefront',
        'Castles',
        'Countryside',
        'Desert',
        'Tropical'
      ],
      default: 'Trending'
    },
    amenities: {
      type: [String],
      default: ['Wifi', 'Kitchen', 'Air Conditioning']
    },
    maxGuests: {
      type: Number,
      default: 4,
      min: 1
    },
    bedrooms: {
      type: Number,
      default: 2,
      min: 1
    },
    bathrooms: {
      type: Number,
      default: 1,
      min: 1
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Compound index for optimized text search and filtering
listingSchema.index({ title: 'text', location: 'text', country: 'text' });
listingSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Listing', listingSchema);
