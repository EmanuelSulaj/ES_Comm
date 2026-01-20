import React from 'react';  
import { Link } from 'react-router-dom';
import { menuItems } from '../data/menuItems';

function Sidebar({ activeSection, setActiveSection, productsSubmenuOpen, setProductsSubmenuOpen }) {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <Link to="/" className="admin-logo">EScomm.</Link>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              className={`nav-item ${activeSection === item.id || (item.id === 'products' && (activeSection === 'product-list' || activeSection === 'categories')) ? 'active' : ''}`}
              onClick={() => {
                if (item.id === 'products') {
                  setProductsSubmenuOpen(!productsSubmenuOpen);
                  if (!productsSubmenuOpen) {
                    setActiveSection('product-list');
                  }
                } else {
                  setActiveSection(item.id);
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={item.iconPath} />
              </svg>
              <span>{item.label}</span>
              {item.id === 'products' && (
                <svg 
                  className={`submenu-arrow ${productsSubmenuOpen ? 'open' : ''}`}
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}
            </button>
            {item.id === 'products' && productsSubmenuOpen && (
              <div className="submenu">
                <button
                  className={`submenu-item ${activeSection === 'product-list' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('product-list');
                  }}
                >
                  <span>Product List</span>
                </button>
                <button
                  className={`submenu-item ${activeSection === 'categories' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('categories');
                  }}
                >
                  <span>Categories</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <Link to="/" className="sidebar-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Back to Shop</span>
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;

