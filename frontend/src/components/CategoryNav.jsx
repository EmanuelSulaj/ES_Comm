import React from 'react';  
import { useState, useRef } from 'react';
import './CategoryNav.css';

function CategoryNav() {
  const categories = ['Watch', 'Earbuds', 'Mouse', 'Decoration', 'Headphones', 'Speakers'];
  const [activeCategory, setActiveCategory] = useState('Watch'); 

  return (
    <div className="category-nav-wrapper">
      <div className="category-nav-container">
        {/* We wrap the items in a 'marquee' div */}
        <div className="category-nav-marquee">
          <div className="category-nav-track">
            {/* First Set */}
            {categories.map((category, index) => (
              <button
                key={`first-${index}`}
                className={`category-pill ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
            {/* Second Set (Duplicate for seamless loop) */}
            {categories.map((category, index) => (
              <button
                key={`second-${index}`}
                className={`category-pill ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryNav;
