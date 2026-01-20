import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import './Header.css';

function Header() {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const { cart } = useCart();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 2. Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <header className="header">
      {/* This section handles the conditional logic correctly */}
      {isBannerVisible && (
        <div className="promo-banner">
          <div className="banner-container"> {/* New Wrapper */}
            <p className="banner-text">Get 20% OFF on Your First Order!</p>
            <div className="banner-actions">
              <button className="claim-offer-btn">Claim Offer</button>
              <button
                className="close-banner-btn"
                onClick={() => setIsBannerVisible(false)}
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      )}
      

      <nav className="main-nav">
        <div className="nav-container">
          <Link to="/" className="logo">EScomm.</Link>

          <div className="nav-links">
            <Link to="/" className="nav-link active">Home</Link>
            <Link to="/shop" className="nav-link">Shop</Link>
            
            {user && user.role === 'admin' && (
              <Link to="/admin" className="nav-link">Admin</Link>
            )}
          </div>

          <div className="nav-actions">
            <div className="search-bar">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input type="text" placeholder="Search products" />
            </div>

            <Link to="/cart" className="cart-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="cart-badge">{totalItems}</span>
              <span className="cart-text">Cart</span>
            </Link>

            {user ? (
              <button onClick={handleLogout} className="login-btn logout-btn">
                Logout
              </button>
            ) : (

            <Link to="/login" className="login-btn">Login</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
