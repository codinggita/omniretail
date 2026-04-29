const express = require('express');
const { getDashboardStats } = require('../controllers/dashboard.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.get('/stats', protect, getDashboardStats);

module.exports = router;
