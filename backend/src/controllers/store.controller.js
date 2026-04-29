const Store = require('../models/store.model.js');
const Product = require('../models/product.model.js');

// @desc  Get all stores or filter by proximity
// @route GET /api/v1/stores/nearby
exports.getNearbyStores = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    let query = {};

    // If coordinates are provided, search within radius (km)
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      };
    }

    const stores = await Store.find(query);
    res.json(stores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc  Get stock status for a product at a specific store
// @route GET /api/v1/stores/:storeId/stock/:productId
exports.getStoreStock = async (req, res) => {
  try {
    const { storeId, productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // In a real multi-warehouse app, we'd have a 'Stock' model linking Product and Store.
    // For this version, we'll simulate the store-specific stock based on the product's global stock.
    const statuses = ['In Stock', 'Low Stock', 'Out of Stock'];
    const randomStatus = product.stockQuantity > 5 ? 'In Stock' : (product.stockQuantity > 0 ? 'Low Stock' : 'Out of Stock');
    
    res.json({
      status: randomStatus,
      quantity: Math.min(product.stockQuantity, Math.floor(Math.random() * 10) + 1),
      aisle: `A-${Math.floor(Math.random() * 20)}-${Math.floor(Math.random() * 5)}`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Seed initial stores if none exist
// @route POST /api/v1/stores/seed
exports.seedStores = async (req, res) => {
  try {
    const count = await Store.countDocuments();
    if (count > 0) return res.status(400).json({ message: 'Stores already exist' });

    const initialStores = [
      {
        name: 'OmniRetail Downtown',
        address: '123 Tech Park, MG Road',
        city: 'Bengaluru',
        location: { coordinates: [77.5946, 12.9716] },
        phone: '+91 98765 43210',
      },
      {
        name: 'OmniRetail Suburban',
        address: '45 Green Valley, Whitefield',
        city: 'Bengaluru',
        location: { coordinates: [77.7500, 12.9698] },
        phone: '+91 98765 43211',
      },
      {
        name: 'OmniRetail Electronic City',
        address: 'Sector 4, Phase II',
        city: 'Bengaluru',
        location: { coordinates: [77.6650, 12.8399] },
        phone: '+91 98765 43212',
      }
    ];

    await Store.insertMany(initialStores);
    res.status(201).json({ message: 'Stores seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Seed failed', error: error.message });
  }
};
