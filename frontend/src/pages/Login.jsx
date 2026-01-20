import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '', // Added for registration
    email: '',    // Used as identifier in login
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }

   
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    // Prepare the body based on Login vs Register
    const requestBody = isLogin 
      ? { identifier: formData.email, password: formData.password } // identifier can be email or username
      : { username: formData.username, email: formData.email, password: formData.password };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          if (data.user.role === 'admin') {
            window.location.href = '/admin';
          } else {
            window.location.href = '/'; 
          }
        } else {
          alert("Registration successful! Please login.");
          setIsLogin(true); // Switch to login tab after registration
        }
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error('Connection Error:', error);
      alert('Failed to connect to the server.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <Link to="/" className="login-logo">EScomm.</Link>
          <div className="login-hero">
            <h1>Welcome to EScomm</h1>
            <p>Your one-stop shop for amazing gadgets and products</p>
            <img
              src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Shopping"
              className="login-hero-image"
            />
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-container">
            <div className="login-tabs">
              <button
                className={`tab ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`tab ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {/* --- USERNAME FIELD (Only for Sign Up) --- */}
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Choose a unique username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">{isLogin ? "Username or Email" : "Email Address"}</label>
                <input
                  type={isLogin ? "text" : "email"} // Allows username typing in login
                  id="email"
                  name="email"
                  placeholder={isLogin ? "Enter username or email" : "Enter your email"}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              {isLogin && (
                <div className="form-options">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-password">Forgot Password?</a>
                </div>
              )}

              <button type="submit" className="submit-btn">
                {isLogin ? 'Login' : 'Create Account'}
              </button>

              <div className="social-login">
                <div className="divider">
                  <span>OR</span>
                </div>
                <button type="button" className="social-btn google-btn">
                  Continue with Google
                </button>
              </div>
            </form>

            <p className="login-footer">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                className="toggle-form"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;