const express = require('express');
const router = express.Router();
const { getNearbyStores, getStoreStock, seedStores } = require('../controllers/store.controller.js');

router.get('/nearby', getNearbyStores);
router.get('/:storeId/stock/:productId', getStoreStock);
router.post('/seed', seedStores);

module.exports = router;
