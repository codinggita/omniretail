const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  generateApiKey,
  updateUserProfile,
} = require('../controllers/user.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');
const passport = require('passport');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/api-key', protect, generateApiKey);

// Google Auth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = require('../utils/generateToken')(req.user._id);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    // Redirect with token and user info
    const userData = encodeURIComponent(JSON.stringify({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      token
    }));
    res.redirect(`${frontendUrl}/login?data=${userData}`);
  }
);

module.exports = router;
