import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Success = () => {
  const hasRun = useRef(false);
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState('processing'); 
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const recordOrder = async () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      const snapshot = JSON.parse(localStorage.getItem('order_snapshot'));
      const totalAmount = parseFloat(localStorage.getItem('order_total') || 0);
      
      if (!userData || !snapshot || snapshot.length === 0) {
        console.error("⛔ No cart snapshot found for order");
        setOrderStatus('error');
        setErrorMessage('No order data found. Please try again.');
        return;
      }

      try {
        console.log("📦 Sending order to backend...");
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/success`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userData.id || userData._id,
            items: snapshot.map(i => ({
              name: i.name,
              category: i.category?.name || i.category || "Uncategorized",
              qty: i.quantity,
              image: i.image,
              price: i.price,
              productId: i._id || i.id  
            })),
            totalAmount,
            sessionId: localStorage.getItem('stripe_session_id')
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to save order');
        }

        console.log("✅ Order saved successfully:", data);
        setOrderStatus('success');

    
        localStorage.removeItem('order_snapshot');
        localStorage.removeItem('order_total');
        localStorage.removeItem('stripe_session_id');
        
      } catch (error) {
        console.error("❌ Failed to save order:", error);
        setOrderStatus('error');
        setErrorMessage(error.message || 'Failed to process order');
      }
    };

    recordOrder();
  }, []);

  
  if (orderStatus === 'processing') {
    return (
      <div className="success-page" style={{ textAlign: 'center', marginTop: '150px' }}>
        <div style={{ fontSize: '60px' }}>⏳</div>
        <h1>Processing your order...</h1>
        <p>Please wait while we confirm your purchase and update inventory.</p>
      </div>
    );
  }

  
  if (orderStatus === 'error') {
    return (
      <div className="success-page" style={{ textAlign: 'center', marginTop: '150px' }}>
        <div style={{ fontSize: '60px', color: '#dc3545' }}>❌</div>
        <h1>Order Processing Failed</h1>
        <p style={{ color: '#dc3545', fontWeight: 'bold' }}>{errorMessage}</p>
        <p>Your payment was successful, but we couldn't record your order.</p>
        <p>Please contact support with your payment confirmation.</p>
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            padding: '12px 30px', 
            cursor: 'pointer', 
            marginTop: '20px',
            backgroundColor: '#6772e5',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1rem'
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  
  return (
    <div className="success-page" style={{ textAlign: 'center', marginTop: '150px' }}>
      <div style={{ fontSize: '60px', color: '#4BB543' }}>✓</div>
      <h1>Payment Successful!</h1>
      <p>Your order has been confirmed and inventory has been updated.</p>
      <p style={{ color: '#666', marginTop: '10px' }}>
        You'll receive a confirmation email shortly.
      </p>
      
      <div style={{ marginTop: '30px' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            padding: '12px 30px', 
            cursor: 'pointer', 
            marginRight: '10px',
            backgroundColor: '#6772e5',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Continue Shopping
        </button>
      </div>
      
      <div style={{ marginTop: '15px' }}>
        <Link 
          to="/" 
          style={{ 
            color: '#6772e5', 
            textDecoration: 'none',
            fontSize: '0.95rem'
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Success;