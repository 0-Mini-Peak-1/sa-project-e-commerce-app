import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/ProductPage.css";
import Header from "./Header";
import { supabase } from "../supabaseClient";
import { CartContext } from "../context/CartContext";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext); // Access addToCart from context
  const navigate = useNavigate(); // Initialize navigate for redirection

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("Product").select("*");
    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  const handleBuyNow = (product) => {
    // Add to cart in the same format with a quantity of 1
    addToCart({ ...product, quantity: 1 });

    // Navigate to the CheckoutPage
    navigate("/checkout-page");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="product-page">
      <Header />
      <main className="product-grid">
        {products.map((product) => (
          <div key={product.ProductID} className="product-card">
            <Link to={`/product/${product.ProductID}`}>
              <img src={product.ProductImage} alt={product.ProductName} />
              <h3>{product.ProductName}</h3>
              <div className="prod-description">
                <p>{product.ProductDescription}</p>
              </div>
              <div className="prod-price">
                <p>{new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(product.ProductPrice)}</p>
              </div>
            </Link>
            <div className="product-card-actions">
              {/* <button
                className="add-to-cart-btn"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
              <button
                className="prod-buy-now-btn" // Use the new class for styling
                onClick={() => handleBuyNow(product)}
              >
                Buy Now
              </button> */}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default ProductPage;
