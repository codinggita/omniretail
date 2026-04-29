const express = require('express');
const { getCustomers, getCustomerStats } = require('../controllers/customer.controller.js');
const { protect, authorize } = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.get('/stats', protect, authorize('retailer'), getCustomerStats);
router.get('/', protect, authorize('retailer'), getCustomers);

module.exports = router;
