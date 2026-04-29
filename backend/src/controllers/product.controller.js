const Product = require('../models/product.model.js');

// @desc  Get all products
// @route GET /api/v1/products
exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};
    if (category) query.storeCategory = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Get product by ID
// @route GET /api/v1/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Create product
// @route POST /api/v1/products
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Update product
// @route PUT /api/v1/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Bulk import products
// @route POST /api/v1/products/import
// @access Private
exports.bulkImport = async (req, res) => {
  try {
    const products = req.body.products;
    if (!Array.isArray(products)) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array of products.' });
    }

    const result = await Product.insertMany(products, { ordered: false });
    res.status(201).json({
      message: `${result.length} products imported successfully`,
      count: result.length
    });
  } catch (error) {
    // If some succeeded but others failed (e.g. duplicate SKU)
    if (error.insertedDocs) {
      return res.status(207).json({
        message: 'Partial import successful',
        count: error.insertedDocs.length,
        error: error.message
      });
    }
    res.status(500).json({ message: 'Import failed', error: error.message });
  }
};

