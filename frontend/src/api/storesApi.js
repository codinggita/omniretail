/**
 * storesApi.js
 *
 * This file handles everything related to physical OmniRetail store locations.
 *
 * ⚠️  NOTE FOR DEVELOPERS:
 *     Right now, these functions use FAKE data (called "mock data") instead of
 *     calling a real backend server. This is a common trick used during development
 *     when the backend isn't ready yet — it lets the frontend work and look correct
 *     without needing a real API.
 *
 *     When the real backend is ready, replace the mock data + setTimeout calls
 *     with real apiClient.get() calls (just like in productsApi.js).
 */


// ─── Fake Store Data (Mock Data) ─────────────────────────────────────────────
//
// This is a hardcoded list of stores that we pretend the server sent us.
// In a real app this would come from the database via the backend API.
//
const MOCK_STORES = [
  {
    _id: 's1',                              // Unique ID (like what MongoDB would generate)
    name: 'OmniRetail Downtown',
    address: '123 Tech Park, MG Road',
    city: 'Bengaluru',
    location: { coordinates: [77.5946, 12.9716] }, // [longitude, latitude] for the map
    phone: '+91 98765 43210',
  },
  {
    _id: 's2',
    name: 'OmniRetail Suburban',
    address: '45 Green Valley, Whitefield',
    city: 'Bengaluru',
    location: { coordinates: [77.7500, 12.9698] },
    phone: '+91 98765 43211',
  },
];


/**
 * getNearbyStores
 *
 * Finds stores near the user's current location.
 *
 * @param {number} lat    - The user's latitude  (e.g. 12.9716)
 * @param {number} lng    - The user's longitude (e.g. 77.5946)
 * @param {number} radius - How far to search in kilometres (default: 10 km)
 * @returns {Promise<Array>} A list of nearby store objects
 *
 * 🚧 Currently returns fake mock data after a 600ms delay (to simulate network latency).
 *
 * TODO: Replace with a real API call once the backend is ready:
 *   return apiClient.get(`/stores/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
 */
export const getNearbyStores = async (lat, lng, radius = 10) => {
  // "new Promise" lets us simulate an async operation (like a network request)
  // setTimeout waits 600 milliseconds before resolving — it mimics real network delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_STORES), 600);
  });
};


/**
 * getStoreStock
 *
 * Checks how much stock a specific product has at a specific store.
 *
 * @param {string} storeId   - The ID of the store to check
 * @param {string} productId - The ID of the product to look up
 * @returns {Promise<Object>} An object like: { status: 'In Stock', quantity: 5, aisle: 'A-3-1' }
 *
 * 🚧 Currently returns randomised fake data after a 400ms delay.
 *    This is useful for seeing how the UI looks with different stock statuses.
 *
 * TODO: Replace with a real API call once the backend is ready:
 *   return apiClient.get(`/stores/${storeId}/stock/${productId}`);
 */
export const getStoreStock = async (storeId, productId) => {
  return new Promise((resolve) => {
    // Randomly pick one of the three possible stock statuses
    const statuses = ['In Stock', 'Low Stock', 'Out of Stock'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    // If out of stock, quantity is 0; otherwise pick a random number between 1 and 20
    const quantity =
      randomStatus === 'Out of Stock' ? 0 : Math.floor(Math.random() * 20) + 1;

    // Generate a random aisle label like "A-7-1"
    const aisle = 'A-' + Math.floor(Math.random() * 20) + '-1';

    // Simulate a 400ms server response delay, then return the fake data
    setTimeout(() => resolve({ status: randomStatus, quantity, aisle }), 400);
  });
};
