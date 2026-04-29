const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  bulkImport,
} = require('../controllers/product.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.get('/', protect, getProducts);
router.get('/:id', protect, getProductById);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.post('/import', protect, bulkImport);

module.exports = router;
