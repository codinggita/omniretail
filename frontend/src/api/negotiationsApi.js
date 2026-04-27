/**
 * negotiationsApi.js
 *
 * This file handles all the "price negotiation" features of OmniRetail.
 * Customers can negotiate a price with the store owner through a chat-like interface.
 *
 * How it works in plain English:
 *   1. A customer picks a product and starts a negotiation (createNegotiation)
 *   2. They can send messages / counter-offers (sendNegotiationMessage)
 *   3. The store owner can accept or reject the deal (acceptNegotiation / rejectNegotiation)
 */

import apiClient from './apiClient.js';


/**
 * getNegotiations
 *
 * Fetches ALL negotiations for the currently logged-in user.
 * (Customers see their own negotiations; admins see all of them.)
 *
 * @returns {Promise<Array>} A list of negotiation objects
 */
export const getNegotiations = () => apiClient.get('/negotiations');


/**
 * createNegotiation
 *
 * Starts a brand-new negotiation for a specific product.
 *
 * @param {string} productId - The ID of the product the customer wants to negotiate on
 * @returns {Promise<Object>} The newly created negotiation object
 */
export const createNegotiation = (productId) =>
  apiClient.post('/negotiations', { productId });


/**
 * getNegotiationById
 *
 * Fetches the full details of one specific negotiation (including its message history).
 *
 * @param {string} id - The negotiation's unique ID
 * @returns {Promise<Object>} The negotiation object with messages
 */
export const getNegotiationById = (id) =>
  apiClient.get(`/negotiations/${id}`);


/**
 * sendNegotiationMessage
 *
 * Sends a new message (and optionally a price offer) inside a negotiation chat.
 *
 * @param {string} id      - The negotiation's unique ID
 * @param {string} content - The text message to send (e.g. "Can you do ₹450?")
 * @param {number} offer   - (Optional) The price the customer is offering in rupees
 * @returns {Promise<Object>} The updated negotiation with the new message added
 */
export const sendNegotiationMessage = (id, content, offer) =>
  apiClient.post(`/negotiations/${id}/message`, { content, offer });


/**
 * acceptNegotiation
 *
 * The store owner accepts the customer's offered price — deal confirmed!
 *
 * @param {string} id - The negotiation's unique ID
 * @returns {Promise<Object>} The updated negotiation with status "accepted"
 */
export const acceptNegotiation = (id) =>
  apiClient.put(`/negotiations/${id}/accept`, {});


/**
 * rejectNegotiation
 *
 * The store owner rejects the customer's offered price — no deal.
 *
 * @param {string} id - The negotiation's unique ID
 * @returns {Promise<Object>} The updated negotiation with status "rejected"
 */
export const rejectNegotiation = (id) =>
  apiClient.put(`/negotiations/${id}/reject`, {});
