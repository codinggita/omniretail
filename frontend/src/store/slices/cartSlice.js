import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // [{ product, quantity, unitPrice, negotiated }]
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { product, quantity = 1, unitPrice = null } = action.payload;
      const existingItem = state.items.find(item => item.product._id === product._id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ 
          product, 
          quantity, 
          unitPrice: unitPrice || product.basePrice, 
          negotiated: !!unitPrice 
        });
      }
    },
    removeItem: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product._id !== productId);
    },
    applyNegotiatedPrice: (state, action) => {
      const { productId, finalPrice } = action.payload;
      const item = state.items.find(item => item.product._id === productId);
      if (item) {
        item.unitPrice = finalPrice;
        item.negotiated = true;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, applyNegotiatedPrice, clearCart } = cartSlice.actions;

// Selector for total
export const selectCartTotal = (state) => 
  state.cart.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

export default cartSlice.reducer;
