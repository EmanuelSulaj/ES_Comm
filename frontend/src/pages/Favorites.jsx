import React, { useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFavorites } from '../Context/FavoritesContext';
import ProductGrid from '../components/ProductGrid';
import './Favorites.css';

function Favorites() {
  const { getFavoriteProducts, loading } = useFavorites();
  const navigate = useNavigate();
  
  // Memoize to prevent unnecessary re-renders
  const favoriteProducts = useMemo(() => getFavoriteProducts(), [getFavoriteProducts]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="favorites-container">
        <div className="loading-spinner">Loading favorites...</div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1>My Favorites</h1>
        <p className="favorites-subtitle">
          {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="no-favorites">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <h2>No favorites yet</h2>
          <p>Start adding products to your favorites by clicking the heart icon on any product card.</p>
          <Link to="/shop" className="shop-link">Browse Products</Link>
        </div>
      ) : (
        <ProductGrid
          title=""
          subtitle=""
          products={favoriteProducts}
        />
      )}
    </div>
  );
}

export default Favorites;

