const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  bulkImport,
} = require('../controllers/product.controller.js');
const { protect, authorize } = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.get('/', protect, getProducts);
router.get('/:id', protect, getProductById);
router.post('/', protect, authorize('retailer'), createProduct);
router.put('/:id', protect, authorize('retailer'), updateProduct);
router.post('/import', protect, authorize('retailer'), bulkImport);

module.exports = router;
