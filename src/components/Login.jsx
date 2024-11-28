import React, { useState, useContext } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { supabase } from '../supabaseClient';

const Login = () => {
  const { setUser } = useContext(UserContext); // Access setUser from context
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
        const { data, error } = await supabase
            .from('Customer')
            .select('*')
            .eq('Username', username)
            .eq('Password', password)
            .single();

        if (error || !data) {
            setError('Invalid username or password');
        } else {
            if (username === 'admin') {
                // Check if the username is admin
                setSuccess('Admin login successful');
                setUser(data); // Update the user context
                navigate('/admin-page'); // Redirect to admin page
            } else {
                setSuccess('Login successful');
                setUser(data); // Update the user context
                navigate('/'); // Redirect to the home page
            }
        }
    } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
    }
};


  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
        <a href="#home" onClick={() => navigate("/")}>
        <h1>P&P</h1>
        <p>PAD PRINTING</p>
        </a>
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input 
            type="text" 
            id="username" 
            value={username} onChange={(e) => setUsername(e.target.value)} 
            required 
            placeholder="Enter your username" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password" />
          </div>
          <div className="forgot-password">
            <a href="https://www.youtube.com/watch?v=P4XVvma2Iyc">Forget Password?</a>
          </div>
          <button className="btn login-btn" type="submit">Log in</button>
          <button className="btn register-btn" onClick={() => navigate("/signup-choice")}>
            Register
          </button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
    </div>
  );
};

export default Login;
