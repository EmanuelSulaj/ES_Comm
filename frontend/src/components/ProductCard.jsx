import React, { memo, useCallback } from 'react';  
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { useFavorites } from '../Context/FavoritesContext';
import './ProductCard.css';

const ProductCard = memo(function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorited, toggleFavorite } = useFavorites();
  
  // Memoize favorited state to prevent unnecessary re-renders
  const favorited = isFavorited(product._id);

  // Safety check: if product is missing for any reason, don't crash the app
  if (!product) return null;

  const renderStars = (rating) => {
    const productRating = rating || 0; 
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < productRating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  const handleClick = () => {
    // Navigates using the MongoDB Unique ID
    navigate(`/product/${product._id}`); 
  };

  const handleAdd = (e) => {
    e.stopPropagation(); 
    addToCart(product);
  };

  const handleFavorite = useCallback(async (e) => {
    e.stopPropagation();
    e.preventDefault();
    await toggleFavorite(product._id);
  }, [product._id, toggleFavorite]);

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-image">
        <img 
          src={product.image} 
          alt={product.name} 
          onError={(e) => {
            e.target.onerror = null; 
            // Option A: Use a more stable service like placehold.co
            e.target.src = "https://placehold.co/300x300?text=No+Image";

          }}
        />
        <button 
          className={`favorite-btn ${favorited ? 'active' : ''}`}
          onClick={handleFavorite}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        {/* 🛡️ RENDER CATEGORY NAME: Prevents "Object as Child" error */}
        <p className="product-category" style={{ fontSize: '0.8rem', color: '#667' }}>
          {product.category?.name || "General"}
        </p>

        <div className="product-rating">
          {renderStars(product.rating)}
        </div>
        <div className="product-price">${product.price}</div>
        <button className="add-btn" onClick={handleAdd}>+</button>
      </div>
    </div>
  );
});

export default ProductCard;