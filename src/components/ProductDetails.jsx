import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../styles/ProductDetails.css";
import Header from "../components/Header";
import { supabase } from "../supabaseClient";

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const { addToCart, cartItems } = useContext(CartContext); // Cart context for adding items
  const [productData, setProductData] = useState(null); // State for product details
  const [loading, setLoading] = useState(true); // Loading state


  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("Product")
        .select("*")
        .eq("ProductID", id) // Fetch product by ID
        .single(); // Expect a single result

      if (error) {
        console.error("Error fetching product details:", error);
      } else {
        setProductData(data);
      }
      setLoading(false);
    };

    fetchProductDetails();
  }, [id]);

  if (loading) return <p>Loading product details...</p>;

  if (!productData) return <p>Product not found.</p>;

  const handleAddToCart = () => {
    const cartItem = cartItems.find((item) => item.ProductID === productData.ProductID);
  
    if (cartItem && cartItem.quantity >= productData.Stock) {
      alert("Cannot add more items than available stock.");
      return;
    }
  
    if (productData.Stock > 0) {
      addToCart(productData); // Add product to cart
      alert("Item added to cart!");
    } else {
      alert("Sorry, this product is out of stock.");
    }
  };
  
  const handleBuyNow = () => {
    const cartItem = cartItems.find((item) => item.ProductID === productData.ProductID);
  
    if (cartItem && cartItem.quantity >= productData.Stock) {
      alert("Cannot add more items than available stock.");
      navigate("/checkout-page");
      return;
    }
  
    if (productData.Stock > 0) {
      addToCart({ ...productData, quantity: 1 });
      navigate("/checkout-page");
    } else {
      alert("Sorry, this product is out of stock.");
    }
  };
  

  return (
    <div>
      <Header />
      <div className="product-details-container">
        <div className="product-detail-image">
          <img src={productData.ProductImage} alt={productData.ProductName} />
        </div>
        <div className="product-detail-info">
          <h1>{productData.ProductName}</h1>
          <p>{productData.ProductDescription}</p>
          <p className="product-detail-price">{new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(productData.ProductPrice)}</p>
          <p className="product-detail-stock">
            <strong>Stock:</strong> {productData.Stock > 0 ? productData.Stock : "Out of Stock"}
          </p>
          <div className="product-detail-actions">
            <button
              onClick={handleAddToCart}
              className="product-detail-add-to-cart-btn"
              disabled={productData.Stock <= 0} // Disable if out of stock
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="product-detail-buy-now-btn"
              disabled={productData.Stock <= 0} // Disable if out of stock
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
