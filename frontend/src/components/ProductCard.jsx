import React from 'react';  
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

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
}

export default ProductCard;