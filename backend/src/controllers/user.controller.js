const User = require('../models/user.model.js');
const generateToken = require('../utils/generateToken.js');
const crypto = require('crypto');

// @desc    Register a new user
// @route   POST /api/v1/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    console.log('Incoming Register Request:', req.body);
    const { name, email, password, role, retailerCategory } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Ensure retailerCategory is provided if role is retailer
    if (role === 'retailer' && !retailerCategory) {
      return res.status(400).json({ message: 'Retailers must provide a category' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      retailerCategory: role === 'retailer' ? retailerCategory : undefined,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        retailerCategory: user.retailerCategory,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(error.name === 'ValidationError' ? 400 : 500).json({ 
      message: error.message || 'Server error' 
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/v1/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email, and explicitly select password (which is hidden by default)
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        retailerCategory: user.retailerCategory,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        retailerCategory: user.retailerCategory,
        apiKeyCreatedAt: user.apiKeyCreatedAt,
        hasApiKey: !!user.apiKey,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Generate API Key
// @route   POST /api/v1/users/api-key
// @access  Private (Retailer)
exports.generateApiKey = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'retailer') {
      return res.status(403).json({ message: 'Only retailers can generate API keys' });
    }

    const rawKey = crypto.randomBytes(32).toString('hex');
    // Store hashed key for security (as per PRD)
    const hashedKey = crypto.createHash('sha256').update(rawKey).digest('hex');

    user.apiKey = hashedKey;
    user.apiKeyCreatedAt = new Date();
    await user.save();

    res.json({ apiKey: rawKey });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while generating API key' });
  }
};
