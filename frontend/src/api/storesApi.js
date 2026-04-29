/**
 * storesApi.js
 *
 * This file handles everything related to physical OmniRetail store locations.
 * It connects the frontend to the backend Store model.
 */

import apiClient from './apiClient.js';

/**
 * getNearbyStores
 *
 * Finds stores near the user's current location from the database.
 *
 * @param {number} lat    - The user's latitude
 * @param {number} lng    - The user's longitude
 * @param {number} radius - How far to search in kilometres (default: 10 km)
 * @returns {Promise<Array>} A list of nearby store objects
 */
export const getNearbyStores = async (lat, lng, radius = 50) => {
  return apiClient.get(`/stores/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
};

/**
 * getStoreStock
 *
 * Checks how much stock a specific product has at a specific store.
 *
 * @param {string} storeId   - The ID of the store to check
 * @param {string} productId - The ID of the product to look up
 * @returns {Promise<Object>} An object like: { status: 'In Stock', quantity: 5, aisle: 'A-3-1' }
 */
export const getStoreStock = async (storeId, productId) => {
  return apiClient.get(`/stores/${storeId}/stock/${productId}`);
};

/**
 * seedStores
 *
 * Helper to seed initial stores if the database is empty.
 */
export const seedStores = async () => {
  return apiClient.post('/stores/seed', {});
};

