import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "../styles/Admin.css";
import Header from "../components/Header";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("stock"); // Tab state
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    ProductName: "",
    Stock: 0,
    ProductPrice: 0,
  }); // State for new product form
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  useEffect(() => {
    if (activeTab === "stock" || activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "invoices") {
      fetchInvoices();
    }
  }, [activeTab]);

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

  const fetchInvoices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Invoice")
      .select("*, InvoiceDetail(*)");
    if (error) {
      console.error("Error fetching invoices:", error);
    } else {
      setInvoices(data);
    }
    setLoading(false);
  };

  const handleUpdateStock = async (productId, newStock) => {
    const { error } = await supabase
      .from("Product")
      .update({ Stock: newStock })
      .eq("ProductID", productId);
    if (error) {
      alert("Error updating stock: " + error.message);
    } else {
      alert("Stock updated successfully!");
      fetchProducts();
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.ProductName || !newProduct.ProductDescription || !newProduct.ProductPrice || !newProduct.Stock || !newProduct.ProductImage) {
        alert("Please fill in all fields!");
        return;
    }

    const { error } = await supabase.from("Product").insert([newProduct]);
    if (error) {
        alert("Error adding product: " + error.message);
    } else {
        alert("Product added successfully!");
        fetchProducts();
        setNewProduct({ ProductName: "", ProductDescription: "", ProductImage: "", Stock: 0, ProductPrice: 0 });
        setShowAddProductForm(false); // Hide form after adding product
    }
};


  const handleDeleteProduct = async (productId) => {
    const { error } = await supabase.from("Product").delete().eq("ProductID", productId);
    if (error) {
      alert("Error deleting product: " + error.message);
    } else {
      alert("Product deleted successfully!");
      fetchProducts();
    }
  };

  return (
    <div>
      <Header />
      <div className="admin-container">
        <h1>Admin Management</h1>
        <div className="admin-tabs">
          <button onClick={() => setActiveTab("stock")} className={activeTab === "stock" ? "active" : ""}>
            Manage Stock
          </button>
          <button onClick={() => setActiveTab("products")} className={activeTab === "products" ? "active" : ""}>
            Manage Products
          </button>
          <button onClick={() => setActiveTab("invoices")} className={activeTab === "invoices" ? "active" : ""}>
            View Invoices
          </button>
        </div>
        <div className="admin-content">
          {loading && <p>Loading...</p>}
          {activeTab === "stock" && (
            <div className="stock-management">
              <h2>Manage Stock</h2>
              {products.map((product) => (
                <div key={product.ProductID} className="stock-item">
                  <p>{product.ProductName}</p>
                  <p>Current Stock: {product.Stock}</p>
                  <input
                    type="number"
                    min="0"
                    defaultValue={product.Stock}
                    onBlur={(e) => handleUpdateStock(product.ProductID, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
          {activeTab === "products" && (
            <div className="product-management">
              <h2>Manage Products</h2>
              <button onClick={() => setShowAddProductForm(!showAddProductForm)}>
                {showAddProductForm ? "Cancel" : "Add New Product"}
              </button>
              {showAddProductForm && (
                <div className="add-product-form">
                    <h3>Add New Product</h3>
                    <label>
                        Product Name:
                        <input
                            type="text"
                            value={newProduct.ProductName}
                            onChange={(e) => setNewProduct({ ...newProduct, ProductName: e.target.value })}
                        />
                        <br />
                    </label>
                    <label>
                        Product Description:
                        <textarea
                            value={newProduct.ProductDescription}
                            onChange={(e) => setNewProduct({ ...newProduct, ProductDescription: e.target.value })}
                        />
                        <br />
                    </label>
                    <label>
                        Product Image URL:
                        <input
                            type="text"
                            value={newProduct.ProductImage}
                            onChange={(e) => setNewProduct({ ...newProduct, ProductImage: e.target.value })}
                        />
                        <br />
                    </label>
                    <label>
                        Stock:
                        <input
                            type="number"
                            min="0"
                            value={newProduct.Stock}
                            onChange={(e) => setNewProduct({ ...newProduct, Stock: parseInt(e.target.value) })}
                        />
                        <br />
                    </label>
                    <label>
                        Price:
                        <input
                            type="number"
                            min="0"
                            value={newProduct.ProductPrice}
                            onChange={(e) => setNewProduct({ ...newProduct, ProductPrice: parseFloat(e.target.value) })}
                        />
                    </label>
                    <button onClick={handleAddProduct}>Save Product</button>
                </div>
            )}
              {products.map((product) => (
                <div key={product.ProductID} className="product-item">
                  <p>{product.ProductName}</p>
                  <p>Price: {product.ProductPrice}</p>
                  <button onClick={() => handleDeleteProduct(product.ProductID)}>Delete</button>
                </div>
              ))}
            </div>
          )}
          {activeTab === "invoices" && (
            <div className="invoice-management">
              <h2>View Invoices</h2>
              {invoices.map((invoice) => (
                <div key={invoice.InvoiceID} className="invoice-item">
                  <p>Invoice ID: {invoice.InvoiceID}</p>
                  <p>Customer ID: {invoice.CustomerID}</p>
                  <p>Total Price: {invoice.TotalPrice}</p>
                  <p>Date: {invoice.Date}</p>
                  <h3>Details:</h3>
                  <ul>
                    {invoice.InvoiceDetail.map((detail) => (
                      <li key={detail.IVDetail_ID}>
                        Product ID: {detail.ProductID}, Quantity: {detail.Quantity}, Price: {detail.TotalPrice}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
