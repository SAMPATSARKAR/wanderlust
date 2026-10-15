const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT token
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'wanderlust_super_secret_jwt_key_2026_secure',
    { expiresIn: '30d' }
  );

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio
    }
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with that email already exists.'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === 'owner' ? 'owner' : 'renter',
      bio
    });

    sendTokenResponse(user, 201, res, 'Registration successful.');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    sendTokenResponse(user, 200, res, 'Login successful.');
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    One-click demo login for instant role testing
// @route   POST /api/auth/demo
// @access  Public
exports.demoLogin = async (req, res, next) => {
  try {
    const { role } = req.body; // 'owner', 'renter', or 'admin'
    const targetRole = ['owner', 'admin'].includes(role) ? role : 'renter';

    let user = await User.findOne({ role: targetRole });

    if (!user) {
      // Create fallback demo user if not found
      user = await User.create({
        name: targetRole === 'owner' ? 'Demo Property Host' : targetRole === 'admin' ? 'Demo Super Admin' : 'Demo Traveler',
        email: `demo.${targetRole}@wanderlust.com`,
        password: 'Password123!',
        role: targetRole,
        bio: `Verified ${targetRole} exploring WanderLust.`
      });
    }

    sendTokenResponse(user, 200, res, `Logged in as demo ${targetRole}.`);
  } catch (error) {
    next(error);
  }
};
