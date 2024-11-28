import React, { useContext, useState } from "react";
import "../styles/Cart.css";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCheckout = () => {
    toggleCart();
    navigate("/checkout-page"); // Navigate to CheckoutPage
  };

  return (
    <div className="cart-container">
      <div className="cart-icon" onClick={toggleCart}>
        🛒
      </div>
      <div className={`cart-panel ${isCartOpen ? "open" : ""}`}>
        <h3>Shopping Cart</h3>
        {cartItems.length > 0 ? (
          <ul>
          {cartItems.map((item) => (
            <li key={item.ProductID}>
              <img
                src={item.ProductImage}
                alt={item.ProductName}
                className="cart-item-image"
              />
              <span>
                <span className="product-name">{item.ProductName}</span>
                <span className="product-price">
                  {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(item.ProductPrice)} x {item.quantity}
                </span>
              </span>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.ProductID)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        
        ) : (
          <p>Your cart is empty.</p>
        )}
        {cartItems.length > 0 && (
          <div className="cart-actions">
          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout
          </button>
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>    
        )}
      </div>
    </div>
  );
};

export default Cart;
