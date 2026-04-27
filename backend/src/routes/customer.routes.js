import express from 'express';
import { getCustomers, getCustomerStats } from '../controllers/customer.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/stats', protect, getCustomerStats);
router.get('/', protect, getCustomers);

export default router;
