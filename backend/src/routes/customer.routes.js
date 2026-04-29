const express = require('express');
const { getCustomers, getCustomerStats } = require('../controllers/customer.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.get('/stats', protect, getCustomerStats);
router.get('/', protect, getCustomers);

module.exports = router;
