/**
 * ordersApi.js
 *
 * This file handles all the communication with the server regarding customer orders.
 * It allows the app to fetch the list of orders, get summary statistics,
 * and update the status of an order (e.g. from "Processing" to "Shipped").
 *
 * All functions use apiClient (our smart messenger) to handle the actual networking.
 */

import apiClient from './apiClient.js';


/**
 * getOrders
 *
 * Fetches a list of orders from the server.
 * You can pass filters like status or search keywords.
 *
 * @param {Object} params - Optional filters, e.g. { status: 'Processing', search: 'ORD123' }
 * @returns {Promise<Array>} A list of order objects
 *
 * Example:
 *   const orders = await getOrders({ status: 'Delivered' });
 *   // Calls → GET /orders?status=Delivered
 */
export const getOrders = (params = {}) => {
  // Convert the params object into a URL query string
  const query = new URLSearchParams(params).toString();

  // Combine path with query string if it exists
  return apiClient.get(`/orders${query ? `?${query}` : ''}`);
};


/**
 * getOrderStats
 *
 * Fetches summary statistics about orders (e.g. total new orders, pending count).
 * These numbers are typically shown in widgets at the top of the Orders page.
 *
 * @returns {Promise<Object>} Statistics object, e.g. { newOrders: 5, pending: 12, returned: 2 }
 */
export const getOrderStats = () => apiClient.get('/orders/stats');


/**
 * updateOrderStatus
 *
 * Changes the status of an existing order.
 * Only admins or store managers usually have permission to do this.
 *
 * @param {string} id     - The unique database ID of the order
 * @param {string} status - The new status (e.g. 'Shipped', 'Delivered', 'Cancelled')
 * @returns {Promise<Object>} The updated order object from the server
 */
export const updateOrderStatus = (id, status) =>
  apiClient.put(`/orders/${id}/status`, { status });
