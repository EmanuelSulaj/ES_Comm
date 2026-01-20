import React from 'react';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css'; // Don't forget to import your CSS

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

 // Simple navigation to your internal custom checkout page
  const handleCheckout = () => {
    localStorage.setItem('order_snapshot', JSON.stringify(cart));
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart" style={{ paddingTop: '150px', textAlign: 'center' }}>
        <h2>Your cart is empty!</h2>
        <button onClick={() => navigate('/')} style={{ marginTop: '20px', cursor: 'pointer' }}>
          Go Shopping
        </button>
      </div>
    );
  }



  return (
    <div className="cart-page-container" style={{paddingTop: '100px'}}> 
      <div className="cart-container">
        {cart.map(item => (
          <div key={item._id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <div className="qty">
              <button onClick={() => updateQuantity(item.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)}>+</button>
            </div>
            <p>${item.price * item.quantity}</p>
            <button onClick={() => removeFromCart(item._id)}>Remove</button>
          </div>
        ))}
        <div className="cart-total">
          {/* --- CHECKOUT BUTTON --- */}
          <button 
            onClick={handleCheckout}
            style={{
              backgroundColor: '#6772e5',
              color: 'white',
              padding: '15px 30px',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '15px'
            }}
          >
            Go to Checkout (${total.toFixed(2)})
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;