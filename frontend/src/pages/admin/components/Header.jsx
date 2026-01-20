import React from 'react';
import { menuItems } from '../data/menuItems';

function Header({ activeSection }) {
  const getTitle = () => {
    if (activeSection === 'product-list') return 'Product List';
    if (activeSection === 'categories') return 'Categories';
    return menuItems.find(item => item.id === activeSection)?.label || 'Dashboard';
  };

  return (
    <header className="admin-header">
      <div className="header-left">
      </div>
      <div className="header-right">
        <div className="header-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input type="text" placeholder="Search..." />
        </div>
        <div className="header-user">
          <div className="user-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}

export default Header;

