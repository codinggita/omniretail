const express = require('express');
const { getDashboardStats, factoryReset } = require('../controllers/dashboard.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.get('/stats', protect, getDashboardStats);
router.delete('/factory-reset', protect, factoryReset);

module.exports = router;
