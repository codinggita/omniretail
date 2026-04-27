import express from 'express';
import {
  getOrders,
  getOrderStats,
  updateOrderStatus,
} from '../controllers/order.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// /stats MUST come before /:id patterns
router.get('/stats', protect, getOrderStats);
router.get('/', protect, getOrders);
router.put('/:id/status', protect, updateOrderStatus);

export default router;
