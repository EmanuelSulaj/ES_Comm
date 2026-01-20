import React, { useEffect, useRef} from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Success = () => {
  const hasRun = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasRun.current) return;
        hasRun.current = true;

      const recordOrder = async () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      const snapshot = JSON.parse(localStorage.getItem('order_snapshot'));
      const totalAmount = parseFloat(localStorage.getItem('order_total') || 0);
      
      if (!userData || !snapshot || snapshot.length === 0) {
        console.error("⛔ No cart snapshot found for order");
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/orders/success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userData.id || userData._id,
            items: snapshot.map(i => ({
              name: i.name,
              qty: i.quantity,
              image: i.image,
              price: i.price,
              product: i._id
            })),
            totalAmount,
            sessionId: localStorage.getItem('stripe_session_id')
          })
        });

         if (response.ok) {
          localStorage.removeItem('order_snapshot');
          localStorage.removeItem('order_total');
          localStorage.removeItem('stripe_session_id');
        }
        
      } catch (error) {
        console.error("❌ Failed to save order:", error);
      }
    };

    recordOrder();
  }, []);

  return (
    <div className="success-page" style={{ textAlign: 'center', marginTop: '150px' }}>
      <div style={{ fontSize: '60px', color: '#4BB543' }}>✓</div>
      <h1>Payment Successful!</h1>
      <p>Your order is confirmed.</p>
      <button 
        onClick={() => navigate('/')} 
        style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '20px' }}
      >
        Continue Shopping
      </button>
      <div style={{ marginTop: '10px' }}>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default Success;
