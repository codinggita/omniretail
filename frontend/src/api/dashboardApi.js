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
 * Example response from server:
 *   {
 *     totalSales: 120000,
 *     totalOrders: 340,
 *     activeUsers: 58,
 *     lowStockItems: 12
 *   }
 *
 * @returns {Promise<Object>} An object with all dashboard stat numbers
 */
export const getDashboardStats = () => apiClient.get('/dashboard/stats');
