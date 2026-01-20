import React from 'react';
import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import CategoryNav from '../components/CategoryNav';
import ProductGrid from '../components/ProductGrid';
import './Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from your backend
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading Products...</div>;

  return (
    <div className="home-page">
      <Hero />
      <CategoryNav />
      
      {/* Pass the real products to the grid */}
      <ProductGrid
        title="Latest Products"
        subtitle={`Showing ${products.length} products`}
        products={products} 
      />
      
      {/* Example: Filter for best selling if you have a property for it later */}
      <ProductGrid
        title="Our Collection"
        subtitle="Freshly added from the vault"
        products={products} 
      />
    </div>
  );
}

export default Home;