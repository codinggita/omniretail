const express = require('express');
const {
  getOrders,
  getOrderStats,
  updateOrderStatus,
} = require('../controllers/order.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');

const router = express.Router();

// /stats MUST come before /:id to avoid route conflicts
router.get('/stats', protect, getOrderStats);
router.get('/', protect, getOrders);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
