/**
 * productsApi.js
 *
 * This file is the single place where we talk to the backend about products.
 * Every CRUD operation (Create, Read, Update, Delete) for products lives here.
 *
 * Think of it like a "remote control" for the product database:
 *   - Get all products       → getProducts()
 *   - Get one product        → getProductById()
 *   - Search for a product   → searchProducts()
 *   - Filter by category     → getProductsByCategory()
 *   - Add a new product      → createProduct()
 *   - Edit a product         → updateProduct()
 *   - Remove a product       → deleteProduct()
 */

import apiClient from './apiClient.js';


/**
 * getProducts
 *
 * Fetches a list of products from the server.
 * You can optionally pass filter/sort options as query parameters.
 *
 * @param {Object} params - Optional filters, e.g. { page: 1, limit: 20, category: 'Electronics' }
 * @returns {Promise<Object>} Usually { products: [...], total: 100, page: 1 }
 *
 * Example:
 *   const result = await getProducts({ page: 2, limit: 10 });
 *   // Calls → GET /products?page=2&limit=10
 */
export const getProducts = async (params = {}) => {
  // Convert the params object into a URL query string
  // e.g. { page: 1, limit: 10 } → "page=1&limit=10"
  const query = new URLSearchParams(params).toString();

  // Only add the "?" if there are actually any query params
  const url = `/products${query ? `?${query}` : ''}`;

  return apiClient.get(url);
};


/**
 * getProductsByCategory
 *
 * Fetches all products that belong to a specific store category.
 *
 * @param {string} storeCategory - Category name, e.g. 'Electronics' or 'Footwear'
 * @returns {Promise<Object>} Products filtered by that category
 *
 * Example:
 *   const result = await getProductsByCategory('Electronics');
 *   // Calls → GET /products?category=Electronics
 */
export const getProductsByCategory = async (storeCategory) => {
  // encodeURIComponent() makes the category name URL-safe
  // (e.g. "Audio & Headphones" → "Audio%20%26%20Headphones")
  return apiClient.get(`/products?category=${encodeURIComponent(storeCategory)}`);
};


/**
 * getProductById
 *
 * Fetches the full details of a single product using its unique ID.
 *
 * @param {string} id - The product's unique ID from the database
 * @returns {Promise<Object>} A single product object with all its details
 *
 * Example:
 *   const product = await getProductById('64abc123...');
 *   // Calls → GET /products/64abc123...
 */
export const getProductById = async (id) => {
  return apiClient.get(`/products/${id}`);
};


/**
 * createProduct
 *
 * Sends new product data to the server to create a new product entry.
 * Only admins/managers should be able to do this.
 *
 * @param {Object} data - The product details, e.g. { name, price, category, stock, ... }
 * @returns {Promise<Object>} The newly created product (including its generated _id)
 *
 * Example:
 *   const newProduct = await createProduct({ name: 'Laptop', price: 55000, stock: 10 });
 */
export const createProduct = async (data) => {
  return apiClient.post('/products', data);
};


/**
 * updateProduct
 *
 * Replaces a product's data on the server with the new data you provide.
 * Use this when you want to update multiple fields at once.
 *
 * @param {string} id   - The ID of the product to update
 * @param {Object} data - The updated product data
 * @returns {Promise<Object>} The updated product object
 *
 * Example:
 *   const updated = await updateProduct('64abc123...', { price: 49999 });
 */
export const updateProduct = async (id, data) => {
  return apiClient.put(`/products/${id}`, data);
};


/**
 * deleteProduct
 *
 * Permanently removes a product from the database.
 * This cannot be undone, so use with caution!
 *
 * @param {string} id - The ID of the product to delete
 * @returns {Promise<null>} Nothing (the server sends back a 204 No Content)
 *
 * Example:
 *   await deleteProduct('64abc123...');
 */
export const deleteProduct = async (id) => {
  return apiClient.delete(`/products/${id}`);
};


/**
 * searchProducts
 *
 * Searches for products whose name or description matches the given keyword.
 *
 * @param {string} query - The keyword to search for, e.g. 'iPhone' or 'running shoes'
 * @returns {Promise<Object>} Products that match the search keyword
 *
 * Example:
 *   const results = await searchProducts('headphones');
 *   // Calls → GET /products?search=headphones
 */
export const searchProducts = async (query) => {
  return apiClient.get(`/products?search=${encodeURIComponent(query)}`);
};


/**
 * getStoreCategories
 *
 * Returns a fixed list of all store categories OmniRetail supports.
 * This is a plain array — it does NOT call the server (no network request).
 *
 * Each object has:
 *   value → the internal string used for filtering
 *   label → the human-readable text shown in dropdowns and filters
 *
 * @returns {Array<{value: string, label: string}>} The list of categories
 */
export const getStoreCategories = () => [
  { value: 'Electronics',       label: 'Electronics & Gadgets' },
  { value: 'Clothing',          label: 'Clothing & Apparel' },
  { value: 'Footwear',          label: 'Footwear' },
  { value: 'Audio & Headphones',label: 'Audio & Headphones' },
  { value: 'Wearables',         label: 'Wearables & Smartwatches' },
  { value: 'Furniture',         label: 'Furniture & Home Decor' },
  { value: 'Groceries',         label: 'Groceries & Fresh Produce' },
  { value: 'Sports',            label: 'Sports & Fitness' },
  { value: 'Beauty',            label: 'Beauty & Personal Care' },
  { value: 'General',           label: 'General / Multi-Category' },
];
