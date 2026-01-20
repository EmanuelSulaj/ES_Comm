import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const stripePromise = loadStripe(
  'pk_test_51SnH4RHkU5f9zEDA52MkSVbA8N3hWuuTXgOWcd2IGccJHheBdWzEc867pZP6IZHkuOmLNsjQjeF8WxbM12e6eQmg001XfQqkhQ'
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // 🔑 Detect Buy Now vs Cart checkout
  const snapshot = JSON.parse(localStorage.getItem('order_snapshot'));
  const isBuyNow = Array.isArray(snapshot) && snapshot.length > 0;

  // 🔒 Single source of truth
  const items = isBuyNow ? snapshot : cart;

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (items.length === 0) {
      alert("No items to checkout");
      return;
    }

    setIsProcessing(true);

    try {
      // 🔐 Create Stripe payment intent
      const response = await fetch('http://localhost:5000/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      });

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        alert(result.error.message);
        setIsProcessing(false);
        return;
      }

      if (result.paymentIntent.status === 'succeeded') {
        // 🧾 Save snapshot ONLY if cart checkout
        if (!isBuyNow) {
          localStorage.setItem('order_snapshot', JSON.stringify(items));
          localStorage.setItem('order_total', total.toFixed(2));
        }

        // 🔑 Unique session ID for deduplication
        localStorage.setItem('stripe_session_id', crypto.randomUUID());

        if (!isBuyNow) {
          clearCart();
        }

        navigate('/success');
      }
    } catch (err) {
      alert("Payment failed. Please try again.");
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-outer-wrapper">
      <div className="checkout-inner-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Review your order and provide payment details</p>
        </div>

        <div className="checkout-grid">
          {/* Left Column: Payment */}
          <div className="payment-column">
            <div className="checkout-card">
              <h3>Credit or Debit Card</h3>
              <form onSubmit={handleSubmit}>
                <div className="card-element-wrapper">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#1a1a1a',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          '::placeholder': { color: '#a0a0a0' },
                        },
                      },
                    }}
                  />
                </div>
                <button
                  disabled={isProcessing || !stripe}
                  className="main-pay-btn"
                >
                  {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <aside className="summary-column">
            <div className="summary-sticky-box">
              <h3>Your Selection</h3>

              <div className="summary-items-scroll">
                {items.map(item => (
                  <div key={item._id} className="summary-product">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="summary-img"
                    />
                    <div className="summary-details">
                      <span className="summary-name">{item.name}</span>
                      <span className="summary-qty">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="summary-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-footer">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free-tag">Free</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => (
  <div className="checkout-page-wrapper">
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  </div>
);

export default Checkout;
