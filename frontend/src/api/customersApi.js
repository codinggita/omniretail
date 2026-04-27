/**
 * customersApi.js
 *
 * This file handles all the communication with the server regarding your customers.
 * It allows you to fetch the customer directory, see how many active customers
 * you have today, and view the feedback they've left.
 */

import apiClient from './apiClient.js';


/**
 * getCustomers
 *
 * Fetches the list of all customers.
 * You can search for a specific customer by name.
 *
 * @param {Object} params - Optional search query, e.g. { search: 'John' }
 * @returns {Promise<Array>} A list of customer objects
 */
export const getCustomers = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiClient.get(`/customers${query ? `?${query}` : ''}`);
};


/**
 * getCustomerStats
 *
 * Fetches summary statistics about your customers.
 * Used for the top widgets on the Customers page (Total, Active, Avg Value).
 *
 * @returns {Promise<Object>} e.g. { total: 100, activeToday: 5, avgLifetimeValue: 1200 }
 */
export const getCustomerStats = () => apiClient.get('/customers/stats');
