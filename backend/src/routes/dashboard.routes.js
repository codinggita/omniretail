const express = require('express');
const { getDashboardStats, factoryReset } = require('../controllers/dashboard.controller.js');
const { protect, authorize } = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.get('/stats', protect, authorize('retailer'), getDashboardStats);
router.delete('/factory-reset', protect, authorize('retailer'), factoryReset);

module.exports = router;
