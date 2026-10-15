const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { seedDatabase } = require('./utils/seedData');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'WanderLust API Gateway',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes (20+ RESTful API Endpoints)
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Centralized error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

// Connect to Database, auto-seed demo records, and start server
const startServer = async () => {
  await connectDB();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🌍 WanderLust MERN Backend Server running on port ${PORT}`);
    console.log(`🔗 REST API Health: http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
};

startServer();
