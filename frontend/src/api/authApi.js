/**
 * authApi.js
 *
 * This file handles all "who are you?" requests to the backend.
 * Any time a user needs to log in, sign up, or fetch their own profile,
 * we call one of the functions below.
 *
 * All functions use apiClient (our smart messenger) so we don't have
 * to repeat headers, error handling, etc.
 */

import apiClient from './apiClient';


/**
 * login
 *
 * Sends the user's email + password to the server.
 * If correct, the server responds with an access token that we can
 * use for all future requests.
 *
 * @param {Object} credentials - Example: { email: 'a@b.com', password: '123' }
 * @returns The server's response (usually contains accessToken + user info)
 */
export const login = async (credentials) => {
  return apiClient.post('/users/login', credentials);
};


/**
 * register
 *
 * Creates a brand new user account on the server.
 *
 * @param {Object} userData - Example: { name: 'Alice', email: 'a@b.com', password: '123' }
 * @returns The server's response (usually contains the new user's info)
 */
export const register = async (userData) => {
  return apiClient.post('/users/register', userData);
};


/**
 * getProfile
 *
 * Fetches the currently logged-in user's profile from the server.
 * The server knows who "the current user" is because apiClient
 * automatically attaches the Bearer token in the Authorization header.
 *
 * @returns The logged-in user's profile data
 */
export const getProfile = async () => {
  return apiClient.get('/users/profile');
};


// Bundle all the functions together so you can also do:
//   import authApi from './authApi';
//   authApi.login(...)
const authApi = {
  login,
  register,
  getProfile,
};

export default authApi;
