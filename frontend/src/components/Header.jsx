import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, NavLink} from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { useFavorites } from '../Context/FavoritesContext';
import './Header.css';

function Header() {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const favoriteCount = favorites.length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsDropdownOpen(false);
    navigate('/login'); 
  };

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <header className="header">
     
      {isBannerVisible && (
        <div className="promo-banner">
          <div className="banner-container"> 
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
              <NavLink to="/" end className="nav-link">
                Home
              </NavLink>
              <NavLink to="/shop" className="nav-link">Shop</NavLink>

              {user && user.role === 'admin' && (
              <Link to="/admin" className="nav-link">Admin</Link>
            )}
          </div>

          <div className="nav-actions">
            <form className="search-bar" onSubmit={handleSearch}>
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input 
                type="text" 
                placeholder="Search products" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
              />
            </form>

            <Link to="/cart" className="cart-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="cart-badge">{totalItems}</span>
              <span className="cart-text">Cart</span>
            </Link>

            {user && (
              <Link to="/favorites" className="favorites-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {favoriteCount > 0 && <span className="favorites-badge">{favoriteCount}</span>}
                <span className="favorites-text">Favorites</span>
              </Link>
            )}

            {user ? (
              <div className="user-menu" ref={dropdownRef}>
                <button 
                  className="user-icon-btn"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-label="User menu"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <p className="dropdown-username">{user.username}</p>
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      My Profile
                    </Link>
                    <button 
                      className="dropdown-item logout-item"
                      onClick={handleLogout}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
