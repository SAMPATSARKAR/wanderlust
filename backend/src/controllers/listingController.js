const Listing = require('../models/Listing');
const Review = require('../models/Review');

// @desc    Get all listings with Server-Side Pagination, Search, and Multi-field Filtering
// @route   GET /api/listings
// @access  Public
exports.getAllListings = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 8,
      category,
      minPrice,
      maxPrice,
      search,
      sort = 'newest'
    } = req.query;

    const query = {};

    // 1. Category Filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // 2. Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 3. Search Filter (title, location, country)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { location: searchRegex },
        { country: searchRegex },
        { description: searchRegex }
      ];
    }

    // 4. Sorting Options
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    // 5. Server-Side Pagination Logic
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 8;
    const skip = (pageNum - 1) * limitNum;

    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .populate('owner', 'name email avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      count: listings.length,
      pagination: {
        total,
        page: pageNum,
        totalPages,
        limit: limitNum,
        hasPrevPage: pageNum > 1,
        hasNextPage: pageNum < totalPages
      },
      data: listings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single listing with populated reviews and owner
// @route   GET /api/listings/:id
// @access  Public
exports.getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      'owner',
      'name email avatar bio'
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found.'
      });
    }

    const reviews = await Review.find({ listing: listing._id })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        ...listing.toObject(),
        reviews
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private (Owner, Admin)
exports.createListing = async (req, res, next) => {
  try {
    const {
      title,
      description,
      image,
      gallery,
      price,
      location,
      country,
      category,
      amenities,
      maxGuests,
      bedrooms,
      bathrooms
    } = req.body;

    if (!title || !description || !image || !price || !location || !country) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required property details.'
      });
    }

    const listing = await Listing.create({
      title,
      description,
      image,
      gallery: gallery || [image],
      price: Number(price),
      location,
      country,
      category: category || 'Trending',
      amenities: amenities || ['Wifi', 'Kitchen', 'Air Conditioning'],
      maxGuests: Number(maxGuests) || 4,
      bedrooms: Number(bedrooms) || 2,
      bathrooms: Number(bathrooms) || 1,
      owner: req.user._id
    });

    const populatedListing = await Listing.findById(listing._id).populate(
      'owner',
      'name email avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Property listing published successfully.',
      data: populatedListing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update listing (Ownership Protected)
// @route   PUT /api/listings/:id
// @access  Private (Owner of listing, Admin)
exports.updateListing = async (req, res, next) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found.'
      });
    }

    listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('owner', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Property updated successfully.',
      data: listing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete listing (Ownership Protected)
// @route   DELETE /api/listings/:id
// @access  Private (Owner of listing, Admin)
exports.deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found.'
      });
    }

    // Cascade delete associated reviews
    await Review.deleteMany({ listing: listing._id });
    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Listing and associated reviews successfully deleted.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get listings owned by currently authenticated user
// @route   GET /api/listings/owner/my-listings
// @access  Private (Owner, Admin)
exports.getMyListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ owner: req.user._id }).sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category counts
// @route   GET /api/listings/meta/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = [
      'Trending',
      'Cabins',
      'Beachfront',
      'Iconic Cities',
      'Lakefront',
      'Castles',
      'Countryside',
      'Desert',
      'Tropical'
    ];

    const counts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Listing.countDocuments({ category: cat });
        return { name: cat, count };
      })
    );

    res.status(200).json({
      success: true,
      data: counts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured listings
// @route   GET /api/listings/meta/featured
// @access  Public
exports.getFeaturedListings = async (req, res, next) => {
  try {
    const featured = await Listing.find({ featured: true })
      .populate('owner', 'name avatar')
      .limit(4);

    res.status(200).json({
      success: true,
      count: featured.length,
      data: featured
    });
  } catch (error) {
    next(error);
  }
};
