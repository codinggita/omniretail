import apiClient from './apiClient.js';

export const getProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await apiClient.get(`/products${query ? `?${query}` : ''}`);
  return res.data;
};

export const getProductsByCategory = async (storeCategory) => {
  const res = await apiClient.get(`/products?category=${encodeURIComponent(storeCategory)}`);
  return res.data;
};

export const getProductById = async (id) => {
  const res = await apiClient.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (data) => {
  const res = await apiClient.post('/products', data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await apiClient.put(`/products/${id}`, data);
  return res.data;
};

export const searchProducts = async (query) => {
  const res = await apiClient.get(`/products?search=${encodeURIComponent(query)}`);
  return res.data;
};

export const getStoreCategories = () => [
  { value: 'Electronics', label: 'Electronics & Gadgets' },
  { value: 'Clothing', label: 'Clothing & Apparel' },
  { value: 'Footwear', label: 'Footwear' },
  { value: 'Audio & Headphones', label: 'Audio & Headphones' },
  { value: 'Wearables', label: 'Wearables & Smartwatches' },
  { value: 'Furniture', label: 'Furniture & Home Decor' },
  { value: 'Groceries', label: 'Groceries & Fresh Produce' },
  { value: 'Sports', label: 'Sports & Fitness' },
  { value: 'Beauty', label: 'Beauty & Personal Care' },
  { value: 'General', label: 'General / Multi-Category' },
];
