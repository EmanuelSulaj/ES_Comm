import React, { useState, useEffect } from 'react';
import { AlertTriangle, Package, TrendingDown, RefreshCw, CheckCircle } from 'lucide-react';
import './StockAlert.css';

const StockAlert = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLowStockProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/low-stock-products');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  return (
    <div className="stock-alert-card">
      <div className={`stock-alert-header ${products.length === 0 && !loading ? 'header-success' : ''}`}>
        <div className="header-title">
          <div className="icon-wrapper">
            {products.length === 0 && !loading ? (
              <CheckCircle size={20} color="white" />
            ) : (
              <AlertTriangle size={20} color="white" />
            )}
          </div>
          <div>
            <h3 className="stock-title">
              {products.length === 0 && !loading ? 'Inventory Healthy' : 'Low Stock Alerts'}
            </h3>
            <p className="stock-subtitle">
              {products.length === 0 && !loading ? 'All items are well stocked' : 'Inventory requiring attention'}
            </p>
          </div>
        </div>
        <button 
          className={`refresh-btn ${loading ? 'spinning' : ''}`} 
          onClick={fetchLowStockProducts}
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="stock-list">
        {loading ? (
          <div className="stock-loading-container">
            <div className="loading-spinner"></div>
            <p>Checking inventory...</p>
          </div>
        ) : products.length === 0 ? (
          /* --- THIS IS THE FIX: The "All Clear" State --- */
          <div className="stock-empty-state">
            <div className="empty-icon-circle">
              <Package size={40} className="package-icon" />
              <CheckCircle size={20} className="check-overlay" />
            </div>
            <h4>Great job!</h4>
            <p>No products are currently under the low-stock threshold (10 units).</p>
          </div>
        ) : (
          products.map((product, index) => (
            <div key={index} className="stock-item">
              <div className="stock-item-info">
                <div className={`stock-icon-box ${product.stock <= 3 ? 'critical' : 'warning'}`}>
                  <Package size={18} />
                </div>
                <div className="stock-details">
                  <span className="product-name">{product.name}</span>
                  <span className="product-cat">{product.category}</span>
                </div>
              </div>

              <div className="stock-status">
                <div className={`stock-number ${product.stock <= 3 ? 'text-red' : 'text-orange'}`}>
                  <TrendingDown size={14} />
                  {product.stock}
                </div>
                <span className="units-label">units left</span>
              </div>
              
              <div className="stock-progress-container">
                <div 
                  className={`stock-progress-bar ${product.stock <= 3 ? 'bg-red' : 'bg-orange'}`}
                  style={{ width: `${(product.stock / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StockAlert;