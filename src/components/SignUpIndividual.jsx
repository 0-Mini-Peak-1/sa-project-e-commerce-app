import React, { useState } from "react";
import "../styles/SignUpIndividual.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const SignUpIndividual = () => {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Insert the new individual user into the database
      const { data, error } = await supabase.from("Customer").insert([
        {
          Username: username, // Map username
          Email: email, // Map email
          Password: password, // Save the plain text password (recommend hashing)
          "Name(Individual)": name, // Map to Name(Individual)
          IsCompany: false, // Explicitly set IsCompany to false
        },
      ]);

      if (error) {
        console.error("Error registering user:", error);
        setError("Error registering user. Please try again.");
      } else {
        console.log("User registered:", data);
        setSuccess("User registered successfully!");

        // Redirect to another page (e.g., login page)
        navigate("/login");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-individual-container">
      <div className="header">
        <a href="#home" onClick={() => navigate("/")}>
          <h1>P&P</h1>
          <p>PAD PRINTING</p>
        </a>
      </div>
      <div className="form-container">
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="name">ชื่อ นามสกุล:</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">อีเมล :</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">รหัสผ่าน :</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
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

export default SignUpIndividual;
