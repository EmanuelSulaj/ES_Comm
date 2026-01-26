import React, { memo, useMemo } from 'react';  
import { useState } from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = memo(function ProductGrid({ title, subtitle, products }) {
  // 1. Set the initial number of products to show (e.g., 8)
  const [visibleCount, setVisibleCount] = useState(8);
  
  // Memoize displayed products to prevent unnecessary re-renders
  const displayedProducts = useMemo(() => {
    return products && products.length > 0 ? products.slice(0, visibleCount) : [];
  }, [products, visibleCount]);

  // 2. Function to increase the count
  const showMore = (e) => {
    e.preventDefault(); // Prevent page jump from "#" link
    setVisibleCount(prev => prev + 8); // Add 8 more on each click
  };

  return (
    <section className="product-grid-section">
      <div className="product-grid-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
          </div>
          
          {/* 3. Conditional Link: Only show if there are more products to reveal */}
          {products && visibleCount < products.length && (
            <a href="#" className="view-more-link" onClick={showMore}>
              View more →
            </a>
          )}
        </div>

        <div className="product-grid">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </section>
  );
});

export default ProductGrid;