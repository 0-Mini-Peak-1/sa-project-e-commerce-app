import React, { useContext, useState, useEffect } from "react";
import Header from "../components/Header";
import "../styles/CheckoutPage.css";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    removeItemCompletely,
    handleQuantityChange,
    calculateTotalPrice,
  } = useContext(CartContext); // Use functions directly from context

  const deliveryFee = 500; // Fixed delivery fee
  const { user } = useContext(UserContext);

  const [userInfo, setUserInfo] = useState({
    name: "",
    companyName: "",
    isCompany: false,
    taxNo: "",
    email: "",
    address: "",
    branchName: "",
    branchAddress: "",
  });

  const [loading, setLoading] = useState(true);
  const [branchID, setBranchID] = useState(null); // To track if branch data exists

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) return;
  
      try {
        setLoading(true);
  
        // Fetch the Customer information
        const { data: customerData, error: customerError } = await supabase
          .from("Customer")
          .select("*")
          .eq("CustomerID", user.CustomerID)
          .single();
  
        if (customerError) {
          console.error("Error fetching customer info:", customerError);
          return;
        }
  
        const updatedUserInfo = {
          customerID: customerData.CustomerID, // Add CustomerID
          name: "",
          companyName: customerData.CompanyName || "",
          isCompany: customerData.IsCompany,
          taxNo: customerData.TaxNo || "",
          email: customerData.Email || "",
          address: customerData.Address || "",
          branchName: "",
          branchAddress: "",
        };
  
        if (customerData.IsCompany) {
          // If the user is a company, fetch the branch details
          if (customerData.BranchID) {
            const { data: branchData, error: branchError } = await supabase
              .from("Branch")
              .select("*")
              .eq("BranchID", customerData.BranchID)
              .single();
  
            if (branchError) {
              console.error("Error fetching branch info:", branchError);
            } else {
              setBranchID(customerData.BranchID); // Store branch ID
              updatedUserInfo.branchName = branchData.BranchName || "";
              updatedUserInfo.branchAddress = branchData.Address || "";
            }
          }
        } else {
          // If the user is an individual, set the name
          updatedUserInfo.name = customerData["Name(Individual)"] || "";
        }
  
        // Update the userInfo state with all gathered details
        setUserInfo(updatedUserInfo);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserInfo();
  }, [user]);

  

  const handleInputChange = (field, value) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmOrder = async () => {
    try {
      // Call the save function and wait for it to complete
      const saveResult = await handleSave(); // Ensure `handleSave` is updated to return a Promise
      if (!saveResult) {
        alert("Failed to save user information. Please try again.");
        return;
      }
  
      // After saving, calculate total amount and proceed to the invoice page
      const totalAmount = calculateTotalPrice() + deliveryFee;
  
      navigate("/invoice", {
        state: {
          userInfo,
          totalAmount,
          cartItems,
          deliveryFee,
        },
      });
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Failed to confirm order. Please try again.");
    }
  };
  


  const handleSave = async () => {
    try {
      let updates;
      if (userInfo.isCompany) {
        updates = {
          CompanyName: userInfo.companyName,
          TaxNo: userInfo.taxNo,
          Email: userInfo.email,
        };
  
        // Update branch details or create new branch if needed
        if (branchID) {
          const { error: branchError } = await supabase
            .from("Branch")
            .update({
              BranchName: userInfo.branchName,
              Address: userInfo.branchAddress,
            })
            .eq("BranchID", branchID);
  
          if (branchError) throw branchError;
        } else if (userInfo.branchName || userInfo.branchAddress) {
          const { data: newBranch, error: branchError } = await supabase
            .from("Branch")
            .insert({
              BranchName: userInfo.branchName,
              Address: userInfo.branchAddress,
            })
            .select()
            .single();
  
          if (branchError) throw branchError;
  
          // Update the Customer table with the new BranchID
          const { error: customerUpdateError } = await supabase
            .from("Customer")
            .update({ BranchID: newBranch.BranchID })
            .eq("CustomerID", user.CustomerID);
  
          if (customerUpdateError) throw customerUpdateError;
  
          setBranchID(newBranch.BranchID); // Store the new branch ID
        }
      } else {
        updates = {
          "Name(Individual)": userInfo.name,
          TaxNo: userInfo.taxNo,
          Email: userInfo.email,
          Address: userInfo.address,
        };
      }
  
      const { error } = await supabase
        .from("Customer")
        .update(updates)
        .eq("CustomerID", user.CustomerID);
  
      if (error) throw error;
  
      // alert("Information saved successfully!");
      return true; // Return success
    } catch (error) {
      console.error("Error saving user info:", error);
      // alert("Failed to save user information.");
      return false; // Return failure
    }
  };
  

  return (
    <div>
      <Header />
      <div className="checkout-container">
        <main className="checkout-main">
          <section className="user-info">
            <h2 className="section-title">Shipping Information</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <form className="shipping-form" onSubmit={handleSave}>
                <label htmlFor="name">
                  {userInfo.isCompany ? "Company Name:" : "Name:"}
                </label>
                <input
                  type="text"
                  id="name"
                  value={
                    userInfo.isCompany ? userInfo.companyName : userInfo.name
                  }
                  onChange={(e) =>
                    handleInputChange(
                      userInfo.isCompany ? "companyName" : "name",
                      e.target.value
                    )
                  }
                />
                <label htmlFor="taxNo">Tax ID / ID Number:</label>
                <input
                  type="text"
                  id="taxNo"
                  value={userInfo.taxNo}
                  onChange={(e) => handleInputChange("taxNo", e.target.value)}
                />
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={userInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                <label htmlFor="address">
                  {userInfo.isCompany ? "Branch Address:" : "Address:"}
                </label>
                <textarea
                  id="address"
                  value={userInfo.isCompany ? userInfo.branchAddress : userInfo.address}
                  onChange={(e) =>
                    handleInputChange(
                      userInfo.isCompany ? "branchAddress" : "address",
                      e.target.value
                    )
                  }
                />
                {userInfo.isCompany && (
                  <>
                    <label htmlFor="branchName">Branch Name:</label>
                    <input
                      type="text"
                      id="branchName"
                      value={userInfo.branchName}
                      onChange={(e) =>
                        handleInputChange("branchName", e.target.value)
                      }
                    />
                  </>
                )}
                <button className="save-btn" type="submit">
                  Save
                </button>
              </form>
            )}
          </section>
          
        {/* Right Section - Cart Summary */}
        <section className="cart-summary">
          <h2>Checkout Cart</h2>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.ProductID}>
                <img
                  src={item.ProductImage}
                  alt={item.ProductName}
                  className="cart-item-image"
                  />
                <p>{item.ProductName}</p>
                
                <p>{new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(item.ProductPrice)}</p>
                <div className="quantity-controls">
                  <button
                    onClick={() => handleQuantityChange(item.ProductID, -1)}
                    >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.ProductID, 1)}
                    >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItemCompletely(item.ProductID)}
                  className="remove"
                  >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary-totals">        
            <p>Delivery Fee: {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(deliveryFee)}</p>
            <p>Total: {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(calculateTotalPrice() + deliveryFee)}</p>
          </div>
          <button className="confirm-btn" onClick={handleConfirmOrder}>Confirm Order</button>
        </section>
        </main>
      </div>
    </div>
  );
};

export default CheckoutPage;
