import apiClient from './apiClient.js';

export const getNegotiations = () => apiClient.get('/negotiations');
export const createNegotiation = (productId) => apiClient.post('/negotiations', { productId });

export const getNegotiationById = (id) => apiClient.get(`/negotiations/${id}`);

export const sendNegotiationMessage = (id, content, offer) =>
  apiClient.post(`/negotiations/${id}/message`, { content, offer });

export const acceptNegotiation = (id) => apiClient.put(`/negotiations/${id}/accept`, {});

export const rejectNegotiation = (id) => apiClient.put(`/negotiations/${id}/reject`, {});
