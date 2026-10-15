const User = require('../models/User');
const Listing = require('../models/Listing');
const Review = require('../models/Review');
const Booking = require('../models/Booking');

const seedDatabase = async () => {
  try {
    const listingCount = await Listing.countDocuments();
    if (listingCount > 0) {
      console.log(`ℹ️ Database already contains ${listingCount} listings. Skipping seed.`);
      return;
    }

    console.log('🌱 Seeding database with WanderLust demo data...');

    // 1. Create Demo Users
    const owner = await User.create({
      name: 'Sampat Sarkar (Host)',
      email: 'owner@wanderlust.com',
      password: 'Password123!',
      role: 'owner',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      bio: 'Superhost and architectural enthusiast dedicated to unique vacation experiences.'
    });

    const renter = await User.create({
      name: 'Alex Johnson (Traveler)',
      email: 'renter@wanderlust.com',
      password: 'Password123!',
      role: 'renter',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      bio: 'Digital nomad exploring breathtaking landscapes and historic city centers.'
    });

    const admin = await User.create({
      name: 'Elena Rostova (Admin)',
      email: 'admin@wanderlust.com',
      password: 'Password123!',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      bio: 'WanderLust Trust & Safety Administrator.'
    });

    // 2. Curated Listings across varied categories
    const sampleListings = [
      {
        title: 'Villa Paradiso Luxury Infinity Pool Retreat',
        description: 'Perched high above the azure Mediterranean waves, Villa Paradiso offers sweeping cliffside views, a heated saltwater infinity pool, private sun terraces, and custom Italian marble interiors.',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
        ],
        price: 380,
        location: 'Amalfi Coast',
        country: 'Italy',
        category: 'Beachfront',
        amenities: ['Wifi', 'Infinity Pool', 'Kitchen', 'Free Parking', 'Air Conditioning', 'Sea View'],
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 3,
        owner: owner._id,
        rating: 4.95,
        reviewCount: 24,
        featured: true
      },
      {
        title: 'Nordic Pine Glass-Ceiling Woodland Cabin',
        description: 'Immerse yourself in secluded Scandinavian wilderness with stargazing glass roof ceilings, a traditional cedarwood sauna, outdoor wood-fired hot tub, and panoramic forest views.',
        image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80'
        ],
        price: 215,
        location: 'Rovaniemi',
        country: 'Finland',
        category: 'Cabins',
        amenities: ['Wifi', 'Sauna', 'Wood Fireplace', 'Hot Tub', 'Dedicated Workspace'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        owner: owner._id,
        rating: 4.92,
        reviewCount: 18,
        featured: true
      },
      {
        title: 'Haussmannian Penthouse overlooking Eiffel Tower',
        description: 'Iconic Parisian luxury apartment featuring classic herringbone parquet, ornate crown moldings, wraparound wrought-iron balconies, and an unobstructed postcard view of the Eiffel Tower.',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'
        ],
        price: 450,
        location: 'Paris, 7th Arrondissement',
        country: 'France',
        category: 'Iconic Cities',
        amenities: ['Wifi', 'Elevator', 'Wine Cellar', 'Air Conditioning', 'Designer Kitchen'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
        owner: owner._id,
        rating: 4.88,
        reviewCount: 31,
        featured: true
      },
      {
        title: 'Alpine Emerald Lakefront Chalet & Dock',
        description: 'Wake up to the glassy reflection of jagged snowcapped peaks on Lake Como. Features a private wooden boat dock, kayaks, floor-to-ceiling glass windows, and a stone outdoor terrace.',
        image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80'
        ],
        price: 320,
        location: 'Lake Como, Bellagio',
        country: 'Italy',
        category: 'Lakefront',
        amenities: ['Wifi', 'Private Dock', 'Kayaks', 'Fireplace', 'Patio'],
        maxGuests: 5,
        bedrooms: 3,
        bathrooms: 2,
        owner: owner._id,
        rating: 4.96,
        reviewCount: 42,
        featured: true
      },
      {
        title: 'Highland 14th Century Scottish Stone Castle',
        description: 'Live like royalty in a meticulously restored historic castle boasting grand tapestries, spiraling stone staircases, a great dining hall with baronial hearth, and 50 acres of rolling private estate.',
        image: 'https://images.unsplash.com/photo-1585543805890-6051f7829f98?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1585543805890-6051f7829f98?auto=format&fit=crop&w=1200&q=80'
        ],
        price: 650,
        location: 'Inverness, Scottish Highlands',
        country: 'United Kingdom',
        category: 'Castles',
        amenities: ['Wifi', 'Great Hall', 'Fireplaces', 'Breakfast Included', 'Private Grounds'],
        maxGuests: 10,
        bedrooms: 5,
        bathrooms: 5,
        owner: owner._id,
        rating: 4.98,
        reviewCount: 15,
        featured: false
      },
      {
        title: 'Kyoto Bamboo Forest Zen Courtyard Villa',
        description: 'Tranquil traditional Machiya house blending centuries-old Japanese woodworking with modern minimalist comfort. Includes tatami tea room, moss rock garden, and open-air Hinoki cypress bath.',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'
        ],
        price: 260,
        location: 'Kyoto, Arashiyama',
        country: 'Japan',
        category: 'Trending',
        amenities: ['Wifi', 'Zen Garden', 'Hinoki Cypress Tub', 'Air Conditioning', 'Tea Master Set'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        owner: owner._id,
        rating: 4.91,
        reviewCount: 29,
        featured: false
      },
      {
        title: 'Santorini Sunset Caldera Cliff Cave Suite',
        description: 'Whitewashed cave architecture sculpted directly into the volcanic cliffs of Oia. Features a private heated cliffside plunge pool overlooking world-famous Aegean Sea sunsets.',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80'
        ],
        price: 410,
        location: 'Oia, Santorini',
        country: 'Greece',
        category: 'Beachfront',
        amenities: ['Wifi', 'Private Plunge Pool', 'Breakfast Included', 'Caldera View', 'Air Conditioning'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        owner: owner._id,
        rating: 4.97,
        reviewCount: 55,
        featured: false
      },
      {
        title: 'Sonoran Desert Stargazing Mirrored Eco-Cube',
        description: 'Futuristic architectural cube clad in reflective two-way mirrored glass, blending completely into the desert horizon. Solar-powered luxury with zero light pollution for celestial night views.',
        image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80'
        ],
        price: 295,
        location: 'Joshua Tree, California',
        country: 'United States',
        category: 'Desert',
        amenities: ['Wifi', 'Telescope', 'Outdoor Fire Pit', 'Solar AC', 'Hot Tub'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        owner: owner._id,
        rating: 4.89,
        reviewCount: 38,
        featured: false
      },
      {
        title: 'Bali Hanging Gardens Bamboo Treehouse',
        description: 'Architectural marvel crafted from golden Petung bamboo suspended over the lush Ayung river valley. Open-air living spaces, plunge pool, and birds-eye jungle views.',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'
        ],
        price: 185,
        location: 'Ubud, Bali',
        country: 'Indonesia',
        category: 'Tropical',
        amenities: ['Wifi', 'Private Plunge Pool', 'Jungle View', 'Organic Breakfast', 'Outdoor Shower'],
        maxGuests: 3,
        bedrooms: 1,
        bathrooms: 1,
        owner: owner._id,
        rating: 4.94,
        reviewCount: 47,
        featured: false
      },
      {
        title: 'Tuscan Olive Grove Farmhouse & Vineyard',
        description: 'Restored 17th-century rustic stone farmhouse nestled among centuries-old olive groves and Chianti vineyards. Features a pizza oven, private cellar, and courtyard dining.',
        image: 'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1200&q=80'
        ],
        price: 240,
        location: 'Siena, Tuscany',
        country: 'Italy',
        category: 'Countryside',
        amenities: ['Wifi', 'Pizza Oven', 'Swimming Pool', 'Vineyard Tours', 'Washing Machine'],
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        owner: owner._id,
        rating: 4.87,
        reviewCount: 22,
        featured: false
      }
    ];

    const createdListings = await Listing.insertMany(sampleListings);
    console.log(`✅ Seeded ${createdListings.length} premium property listings.`);

    // 3. Seed Reviews
    const reviewData = [
      {
        listing: createdListings[0]._id,
        author: renter._id,
        rating: 5,
        comment: 'Hands down the most breathtaking villa we have ever stayed in. The infinity pool and coastal views are surreal. Host communication was 10/10!'
      },
      {
        listing: createdListings[1]._id,
        author: renter._id,
        rating: 5,
        comment: 'Seeing the aurora through the glass ceiling was an unforgettable bucket-list experience. The sauna was warmed up and ready upon arrival.'
      },
      {
        listing: createdListings[2]._id,
        author: renter._id,
        rating: 5,
        comment: 'Unbeatable Paris location! Having coffee on the private balcony watching the Eiffel Tower sparkle made our anniversary trip truly special.'
      }
    ];

    await Review.insertMany(reviewData);

    // 4. Seed an initial booking
    await Booking.create({
      listing: createdListings[0]._id,
      renter: renter._id,
      checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      checkOut: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      guests: 2,
      totalNights: 4,
      pricePerNight: createdListings[0].price,
      totalPrice: createdListings[0].price * 4,
      status: 'confirmed',
      specialRequests: 'Late evening check-in requested.'
    });

    console.log('✅ Seeded demo reviews and sample bookings successfully.');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

module.exports = { seedDatabase };
