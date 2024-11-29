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

  const fetchSalesReport = async () => {
    setLoading(true);
    try {
      // Fetch all InvoiceDetails with related Product information
      const { data, error } = await supabase
        .from("InvoiceDetail")
        .select("ProductID, Quantity, TotalPrice, Product(ProductName)");
  
      if (error) {
        throw new Error("Error fetching sales report: " + error.message);
      }
  
      // Aggregate the data manually
      const reportData = {};
  
      data.forEach((item) => {
        const productName = item.Product.ProductName;
        if (!reportData[productName]) {
          reportData[productName] = { TotalQuantity: 0, TotalRevenue: 0 };
        }
        reportData[productName].TotalQuantity += item.Quantity;
        reportData[productName].TotalRevenue += item.TotalPrice;
      });
  
      // Convert the aggregated data into an array for display
      const formattedReport = Object.keys(reportData).map((productName) => ({
        ProductName: productName,
        TotalQuantity: reportData[productName].TotalQuantity,
        TotalRevenue: reportData[productName].TotalRevenue,
      }));
  
      // Sort by TotalQuantity to show best sellers first
      const sortedReport = formattedReport.sort(
        (a, b) => b.TotalQuantity - a.TotalQuantity
      );
  
      setSalesReport(sortedReport);
    } catch (err) {
      console.error(err.message);
      setSalesReport([]);
    }
    setLoading(false);
  };
  

  const [salesReport, setSalesReport] = useState([]); // Store sales report data

  const processSalesReport = (data) => {
  const processedData = data.map((item) => ({
    ProductName: item.Product.ProductName,
    TotalQuantity: item.Quantity.sum,
    TotalRevenue: item.TotalPrice.sum,
  }));

  // Sort by TotalQuantity to identify best and least sellers
  const sortedData = processedData.sort((a, b) => b.TotalQuantity - a.TotalQuantity);

  setSalesReport(sortedData);
};

const [suppliers, setSuppliers] = useState([]);
const [purchaseData, setPurchaseData] = useState({
  ProductID: "",
  SupplierID: "",
  Quantity: 0,
  Price: 0,
  Date: new Date().toISOString(),
});
const [showPurchaseForm, setShowPurchaseForm] = useState(false);

const fetchSuppliers = async () => {
  const { data, error } = await supabase.from("Supplier").select("*");
  if (error) {
    console.error("Error fetching suppliers:", error);
  } else {
    setSuppliers(data);
  }
};

useEffect(() => {
  fetchSuppliers();
}, []);

const handleStockPurchase = async () => {
  const { ProductID, SupplierID, Quantity, Price, Date } = purchaseData;

  if (!ProductID || !SupplierID || Quantity <= 0 || Price <= 0) {
    alert("Please fill in all fields correctly.");
    return;
  }

  try {
    // Step 1: Record the purchase in the StockPurchase table
    const { error: purchaseError } = await supabase.from("StockPurchase").insert([
      { ProductID, SupplierID, Quantity, Price, Date },
    ]);
    if (purchaseError) throw purchaseError;

    // Step 2: Fetch the current stock of the product
    const { data: productData, error: fetchError } = await supabase
      .from("Product")
      .select("Stock")
      .eq("ProductID", ProductID)
      .single();
    if (fetchError) throw fetchError;

    const currentStock = productData.Stock;

    // Step 3: Calculate the new stock
    const updatedStock = currentStock + Quantity;

    // Step 4: Update the stock in the Product table
    const { error: stockUpdateError } = await supabase
      .from("Product")
      .update({ Stock: updatedStock })
      .eq("ProductID", ProductID);
    if (stockUpdateError) throw stockUpdateError;

    // Notify the admin
    alert("Stock purchase recorded and stock updated successfully!");

    // Refresh product list
    fetchProducts();

    // Hide the purchase form
    setShowPurchaseForm(false);
  } catch (error) {
    console.error("Error recording stock purchase:", error.message);
    alert("Failed to record stock purchase or update stock. Please try again.");
  }
};


const [stockPurchases, setStockPurchases] = useState([]);

const fetchStockPurchases = async () => {
  const { data, error } = await supabase
    .from("StockPurchase")
    .select("*, Product(ProductName), Supplier(SupplierName)");
  if (error) {
    console.error("Error fetching stock purchases:", error);
  } else {
    setStockPurchases(data);
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
          <button onClick={() => setActiveTab("reports")} className={activeTab === "reports" ? "active" : ""}>
            Reports
          </button>
        </div>
        <div className="admin-content">
          {loading && <p>Loading...</p>}
          

          {activeTab === "reports" && (
          <div className="reports-section">
            <h2>Sales Report</h2>
            <button onClick={fetchSalesReport}>Generate Report</button>
            {loading && <p>Loading...</p>}
            {!loading && salesReport.length > 0 && (
              <div>
                <h3>Sales Summary</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Total Quantity Sold</th>
                      <th>Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesReport.map((product) => (
                      <tr key={product.ProductName}>
                        <td>{product.ProductName}</td>
                        <td>{product.TotalQuantity}</td>
                        <td>{new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(product.TotalRevenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <h4>Best Seller: {salesReport[0].ProductName}</h4>
                <h4>Least Seller: {salesReport[salesReport.length - 1].ProductName}</h4>
              </div>
            )}
          </div>
        )}
          {activeTab === "stock" && (
            <div className="stock-management">
              <h2>Manage Stock</h2>
              {products.map((product) => (
                <div key={product.ProductID} className="stock-item">
                  <p>{product.ProductName}</p>
                  <p>Current Stock: {product.Stock}</p>
                  {/* <input
                    type="number"
                    min="0"
                    defaultValue={product.Stock}
                    onBlur={(e) => handleUpdateStock(product.ProductID, e.target.value)}
                  /> */}
                </div>
              ))}
            </div>
          )}
          {activeTab === "products" && (
            
            <div className="product-management">
              {showPurchaseForm && (
          <div className="purchase-form">
            <h3>Record Stock Purchase</h3>
            <label>
              Product:
              <select
                value={purchaseData.ProductID}
                onChange={(e) =>
                  setPurchaseData({ ...purchaseData, ProductID: e.target.value })
                }
              >
                <option value="">Select a Product</option>
                {products.map((product) => (
                  <option key={product.ProductID} value={product.ProductID}>
                    {product.ProductName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Supplier:
              <select
                value={purchaseData.SupplierID}
                onChange={(e) =>
                  setPurchaseData({ ...purchaseData, SupplierID: e.target.value })
                }
              >
                <option value="">Select a Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.SupplierID} value={supplier.SupplierID}>
                    {supplier.SupplierName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Quantity:
              <input
                type="number"
                min="1"
                value={purchaseData.Quantity}
                onChange={(e) =>
                  setPurchaseData({ ...purchaseData, Quantity: parseInt(e.target.value) })
                }
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                min="0"
                value={purchaseData.Price}
                onChange={(e) =>
                  setPurchaseData({ ...purchaseData, Price: parseFloat(e.target.value) })
                }
              />
            </label>
            <button onClick={handleStockPurchase}>Record Purchase</button>
            <button onClick={() => setShowPurchaseForm(false)}>Cancel</button>
          </div>
        )}
        <button onClick={() => setShowPurchaseForm(true)}>Record New Purchase</button>
              <h2>Manage Products</h2>
              {/* <button onClick={() => setShowAddProductForm(!showAddProductForm)}>
                {showAddProductForm ? "Cancel" : "Add New Product"}
              </button> */}
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
