import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { CartContext } from "../context/CartContext";

const Header = ({ className }) => {
  const { user, setUser } = useContext(UserContext); // Access user context
  const { clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    setUser(null); // Clear user context
    clearCart("cartItems"); // Clear shopping cart data from localStorage
    navigate("/login"); // Redirect to the login page
  };

  return (
    <header className={`shared-header ${className}`}>
      <div className="shared-logo">
        <a href="/">
          <h1>P&P</h1>
          <p>PAD PRINTING</p>
        </a>
      </div>
      <nav className="shared-navbar">
        <a href="/">Home Page</a>
        <a href="/product-page">Product</a>
        <a href="/contact-page">Contact Us</a>
        {user ? (
          <div className="user-info-container">
            <div className="user-details">
              {/* {user.IsCompany ? (
                <i className="company-icon"></i> // Display company icon
              ) : (
                <i className="user-icon"></i> // Display person icon
              )} */}
              <span className="welcome-message">
                Welcome, {user.IsCompany ? user.CompanyName : user.Username}
              </span>
            </div>
            <button
              className="logout-btn"
              onClick={handleLogout}
              aria-label="Log Out"
            >
              Log Out
            </button>
          </div>
        ) : (
          <>
            <button
              className="btn sign-up"
              onClick={() => navigate("/signup-choice")}
            >
              Sign Up
            </button>
            <button className="btn login" onClick={() => navigate("/login")}>
              Log In
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
