import React, { createContext, useState, useEffect } from "react";

// Create Cart Context
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sync cartItems with localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add an item to the cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.ProductID === item.ProductID
      );
  
      if (existingItem) {
        if (existingItem.quantity < item.Stock) {
          return prevItems.map((cartItem) =>
            cartItem.ProductID === item.ProductID
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        } else {
          alert("Cannot add more items than available stock.");
          return prevItems;
        }
      } else {
        if (item.Stock > 0) {
          return [...prevItems, { ...item, quantity: 1 }];
        } else {
          alert("This item is out of stock.");
          return prevItems;
        }
      }
    });
  };
  

  // Remove an item or decrease its quantity
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.reduce((acc, item) => {
        if (item.ProductID === productId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 }); // Decrease quantity
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
    );
  };

  // Remove an item completely from the cart
  const removeItemCompletely = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.ProductID !== productId)
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.ProductPrice * item.quantity,
      0
    );
  };

  // Handle quantity change (increase or decrease)
  const handleQuantityChange = (productId, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.ProductID === productId) {
          const newQuantity = item.quantity + change;
  
          // Ensure the new quantity does not exceed the stock
          if (newQuantity > item.Stock) {
            alert("Cannot add more items than available stock.");
            return item; // Return the item unchanged
          }
  
          // Ensure the quantity is at least 1
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item; // Return other items unchanged
      })
    );
  };
  

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        removeItemCompletely,
        clearCart,
        calculateTotalPrice,
        handleQuantityChange, // Exporting the new function
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
