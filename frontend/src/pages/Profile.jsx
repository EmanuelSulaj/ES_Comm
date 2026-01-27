import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFavorites } from '../Context/FavoritesContext';
import ProductCard from '../components/ProductCard';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const navigate = useNavigate();
  const { getFavoriteProducts, refreshFavorites } = useFavorites();
  const favoriteProducts = getFavoriteProducts();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!userData) {
      navigate('/login');
      return;
    }

    setUser(userData);
    fetchUserOrders(userData.id || userData._id);
    refreshFavorites();
  }, [navigate, refreshFavorites]);

  const fetchUserOrders = async (userId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/my-orders/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.paymentStatus === 'Paid').length;

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const renderOverview = () => (
    <>
      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(totalSpent)}</h3>
            <p>Total Spent</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{completedOrders}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{favoriteProducts.length}</h3>
            <p>Favorites</p>
          </div>
        </div>
      </div>

      <div className="overview-grid">
        {favoriteProducts.length > 0 && (
          <div className="overview-section favorites-preview">
            <div className="section-header-compact">
              <h3>Recent Favorites</h3>
              <Link to="/favorites" className="view-all-link-small">View All →</Link>
            </div>
            <div className="favorites-grid-compact">
              {favoriteProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

        {orders.length > 0 && (
          <div className="overview-section recent-orders">
            <div className="section-header-compact">
              <h3>Recent Orders</h3>
              <button 
                className="tab-btn"
                onClick={() => setActiveTab('orders')}
              >
                View All →
              </button>
            </div>
            <div className="orders-preview">
              {orders.slice(0, 3).map((order) => (
                <div key={order._id} className="order-preview-card">
                  <div className="order-preview-header">
                    <span className="order-preview-id">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className={`status-badge-small ${order.paymentStatus.toLowerCase()}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="order-preview-footer">
                    <span className="order-preview-date">{formatDate(order.createdAt)}</span>
                    <span className="order-preview-total">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );

  const renderOrders = () => (
    <div className="orders-section-compact">
      {orders.length === 0 ? (
        <div className="no-orders">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p>No orders yet</p>
          <Link to="/shop" className="shop-link">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list-compact">
          {orders.map((order) => {
            const isExpanded = expandedOrders.has(order._id);
            const itemsToShow = isExpanded ? order.orderItems : order.orderItems.slice(0, 2);
            const hasMoreItems = order.orderItems.length > 2;

            return (
              <div key={order._id} className="order-card-compact">
                <div className="order-header-compact">
                  <div className="order-info-compact">
                    <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="order-date-compact">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-status-compact">
                    <span className={`status-badge ${order.paymentStatus.toLowerCase()}`}>
                      {order.paymentStatus}
                    </span>
                    <span className="order-total-compact">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
                <div className="order-items-compact">
                  {itemsToShow.map((item, index) => (
                    <div key={index} className="order-item-compact">
                      <img 
                        src={item.image || '/placeholder-image.jpg'} 
                        alt={item.name}
                        className="item-image-compact"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="item-details-compact">
                        <h4>{item.name}</h4>
                        <p className="item-meta-compact">{item.qty}x • {formatCurrency(item.price)}</p>
                      </div>
                      <div className="item-price-compact">
                        {formatCurrency(item.price * item.qty)}
                      </div>
                    </div>
                  ))}
                  {hasMoreItems && (
                    <button 
                      className="expand-items-btn"
                      onClick={() => toggleOrderExpansion(order._id)}
                    >
                      {isExpanded ? 'Show Less' : `+${order.orderItems.length - 2} more items`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderFavorites = () => (
    <div className="favorites-section-full">
      {favoriteProducts.length === 0 ? (
        <div className="no-favorites">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <p>No favorites yet</p>
          <Link to="/shop" className="shop-link">Browse Products</Link>
        </div>
      ) : (
        <div className="favorites-grid-full">
          {favoriteProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p className="profile-email">{user.email}</p>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders ({totalOrders})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites ({favoriteProducts.length})
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'favorites' && renderFavorites()}
      </div>
    </div>
  );
}

export default Profile;

