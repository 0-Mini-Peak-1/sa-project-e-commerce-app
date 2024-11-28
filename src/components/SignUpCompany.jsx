import React, { useState } from "react";
import "../styles/SignUpCompany.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const SignUpCompany = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    companyName: "",
    email: "",
    password: "",
    branch: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    try {
      const { data, error } = await supabase.from("Customer").insert([
        {
          Username: formData.username,
          CompanyName: formData.companyName,
          Email: formData.email,
          Password: formData.password,
          BranchID: formData.branch || null, // Default to null if branch is not provided
          IsCompany: true, // Explicitly pass boolean true
        },
      ]);
  
      if (error) {
        console.error("Error registering company:", error);
        setError("Error registering company. Please try again.");
      } else {
        console.log("Company registered:", data);
        setSuccess("Company registered successfully!");
        navigate("/login"); // Redirect to login page
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };
  

  return (
    <div className="signup-company-container">
      <div className="header">
        <a href="#home" onClick={() => navigate("/")}>
          <h1>P&P</h1>
          <p>PAD PRINTING</p>
        </a>
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="companyName">ชื่อ :</label>
            <input
              type="text"
              id="companyName"
              placeholder="Enter company name"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password :</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {/* <div className="input-group">
            <label htmlFor="branch">สาขา :</label>
            <input
              type="text"
              id="branch"
              placeholder="Enter branch (optional)"
              value={formData.branch}
              onChange={handleChange}
            />
          </div> */}
          <button type="submit" className="btn signup-btn">
            Sign Up
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </div>
    </div>
  );
};

export default SignUpCompany;