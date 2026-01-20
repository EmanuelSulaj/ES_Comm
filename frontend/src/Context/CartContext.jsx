import React from 'react';
import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Initialize state from localStorage if it exists
  const [cart, setCart] = React.useState(() => {
    const savedCart = localStorage.getItem('local_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. Sync cart to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('local_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      // Use _id consistently to prevent duplicates
      const existingItem = prev.find((item) => item._id === product._id);
      
      if (existingItem) {
        return prev.map((item) =>
          item._id === product._id 
            ? { ...item, quantity: item.quantity + Number(quantity) } 
            : item
        );
      }
      return [...prev, { ...product, quantity: Number(quantity) }];
    });
  };

  const removeFromCart = (id) => {
    // Ensuring we filter by _id
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, amount) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('local_cart');
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);   