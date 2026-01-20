import React from 'react';
import { useState } from 'react';
import './Hero.css';

function Hero() {
  // 1. Put your card data into an array so we can manipulate it
  const allCards = [
    { id: 1, title: "Best products", color: "card-orange", img: "https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=200" },
    { id: 2, title: "20% discounts", color: "card-blue", img: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=200" },
    { id: 3, title: "New Arrivals", color: "card-green", img: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=200" },
    { id: 4, title: "Tech Deals", color: "card-purple", img: "https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=200" },
  ];

  // 2. State to track how many cards to show
  const [visibleCount, setVisibleCount] = useState(2);

  const showMore = (e) => {
    e.preventDefault(); // Stop page refresh
    setVisibleCount(allCards.length); // Show all cards
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-main">
          <div className="hero-content">
            <span className="hero-badge">
              <span className="badge-label">NEWS</span> Free Shipping on Orders Above $50!
            </span>
            <h1 className="hero-title">
              Gadgets you'll <span className="highlight-green">love.</span>
              <br />
              Prices you'll <span className="highlight-gray">trust.</span>
            </h1>
            <div className="hero-price">
              <span className="price-label">Starts from</span>
              <span className="price-value">$4.90</span>
            </div>
            <button className="hero-cta">LEARN MORE</button>
          </div>
          <div className="hero-image">
            <img
              src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500"
              alt="Woman with headphones"
            />
          </div>
        </div>

        {/* 3. Render cards dynamically using .slice() */}
        <div className="hero-cards">
          {allCards.slice(0, visibleCount).map((card) => (
            <div key={card.id} className={`promo-card ${card.color}`}>
              <div className="card-content">
                <h3>{card.title.split(' ')[0]}<br />{card.title.split(' ')[1]}</h3>
                {/* 4. The View More Link Logic */}
                {visibleCount < allCards.length ? (
                  <a href="#" className="card-link" onClick={showMore}>View more →</a>
                ) : (
                  <a href="#" className="card-link">Explore All →</a>
                )}
              </div>
              <div className="card-image">
                <img src={card.img} alt="Product" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;