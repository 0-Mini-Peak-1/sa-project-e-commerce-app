import React, { useContext, useEffect, useState } from "react";
import "../styles/Homepage.css";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { supabase } from "../supabaseClient";
import Header from "./Header";

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext); // Access addToCart from context

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
    // Add product to cart with a default quantity of 1
    addToCart({ ...product, quantity: 1 });

    // Redirect to the checkout page
    navigate("/checkout-page");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="home-container">
      <Header />

      {/* Main Content */}
      <main className="home-content">
        <section className="intro-section">
          <h2>PAD PRINTING MACHINE</h2>
          <p>
            เครื่องสกรีนโลโก้บนบรรจุภัณฑ์ เครื่องสำอาง เครื่องเขียน
            อุปกรณ์คอมพิวเตอร์ อุปกรณ์กีฬา สินค้าพรีเมียม เครื่องใช้ไฟฟ้า ฯลฯ
          </p>
          <img
            src="https://dh.lnwfile.com/_/dh/_raw/t1/p7/21.jpg"
            alt="Pad Printing Machine"
          />
          <h2>SILK SCREEN PRINTING MACHINE</h2>
          <p>
            เครื่องสกรีนโลโก้ทรงกลมและทรงกระบอก บนบรรจุภัณฑ์ เครื่องสำอาง 
            เครื่องเขียน อุปกรณ์คอมพิวเตอร์ อุปกรณ์กีฬา สินค้าพรีเมียม เครื่องใช้ไฟฟ้า ฯลฯ
          </p>
          <img
            src="https://dh.lnwfile.com/_/dh/_raw/nv/qs/th.jpg"
            alt="Pad Printing Machine"
          />
        </section>

        <section className="product-grid">
          <h2>Our Products</h2>
          <div className="grid">
            {products.map((product) => (
              <div key={product.ProductID} className="product-card">
                <Link to={`/product/${product.ProductID}`}>
                <img src={product.ProductImage} alt={product.ProductName} />
                <h3>{product.ProductName}</h3>
            </Link>
                {/* <div className="product-card-actions">
                  <button
                    className="btn add-to-cart"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn buy-now"
                    onClick={() => handleBuyNow(product)}
                  >
                    Buy Now
                  </button>
                </div> */}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; 2024 P&P PAD PRINTING. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
