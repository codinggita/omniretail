const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  generateApiKey,
  updateUserProfile,
} = require('../controllers/user.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/api-key', protect, generateApiKey);

module.exports = router;
