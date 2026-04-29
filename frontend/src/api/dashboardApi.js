/**
 * dashboardApi.js
 *
 * This file fetches all the summary numbers shown on the Dashboard page —
 * things like total sales, number of orders, active users, etc.
 *
 * The backend calculates all these stats and returns them in one go.
 */

import apiClient from './apiClient.js';


/**
 * getDashboardStats
 *
 * Asks the server for the latest dashboard statistics.
 *
 * @returns {Promise<Object>} An object with all dashboard stat numbers
 */
export const getDashboardStats = () => apiClient.get('/dashboard/stats');


/**
 * factoryReset
 *
 * Clears all transaction and inventory data from the database.
 * WARNING: This action is irreversible.
 *
 * @returns {Promise<Object>} Server response message
 */
export const factoryReset = () => apiClient.delete('/dashboard/factory-reset');

