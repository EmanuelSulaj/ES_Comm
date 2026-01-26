import React, { useState } from 'react';
import { menuItems } from '../data/menuItems';
import { useSearch } from '../../../Context/SearchContext';

function Header({ activeSection }) {
  const { searchQuery, setSearchQuery } = useSearch();
  const [localSearch, setLocalSearch] = useState('');

  const getPlaceholder = () => {
    const section = activeSection || 'dashboard';
    if (section === 'product-list' || section === 'inventory') return 'Search products...';
    if (section === 'customers') return 'Search customers...';
    if (section === 'categories') return 'Search categories...';
    return 'Search...';
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    setSearchQuery(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearchQuery(localSearch);
    }
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
          <input 
            type="text" 
            placeholder={getPlaceholder()}
            value={localSearch}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
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

