import React, { useEffect, useState } from 'react';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/customers-report');
        const data = await response.json();
        // Ensure data is an array before setting state
        setCustomers(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  
  const totalRevenue = customers?.reduce((sum, c) => sum + (c.totalSpent || 0), 0) || 0;

  if (loading) return <div className="loader">Loading Customers...</div>;

  return (
    <div className="customers-page">
      <div className="customers-header">
        <div>
          <h1>Customer Insights</h1>
          <p>Tracking users with successful purchases</p>
        </div>
        <div className="header-stats">
          <div className="stat-box">
            <span>Total Revenue</span>
            <p>${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="stat-box">
            <span>Active Buyers</span>
            <p>{customers.length}</p>
          </div>
        </div>
      </div>

      <div className="customers-grid">
        {customers.length > 0 ? (
          customers.map((customer) => (
            <div key={customer._id} className="customer-profile-card">
              <div className="card-top">
                <div className="user-avatar">
                  {/* FIX: Safe check for charAt */}
                  {customer.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="user-badge">
                  {customer.totalSpent > 500 ? 'VIP' : 'Customer'}
                </div>
              </div>
              
              <div className="user-details">
                {/* FIX: Fallback for missing username/email */}
                <h3>{customer.username || "Unknown User"}</h3>
                <p>{customer.email || "No Email Provided"}</p>
              </div>

              <div className="user-stats-row">
                <div className="stat-item">
                  <span className="stat-label">Orders</span>
                  <span className="stat-value">{customer.orderCount || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Spent</span>
                  <span className="stat-value">
                    ${(customer.totalSpent || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="last-activity">
                Last Purchase: {customer.lastPurchase 
                  ? new Date(customer.lastPurchase).toLocaleDateString() 
                  : 'N/A'}
              </div>

              <button className="btn-details">View Full History</button>
            </div>
          ))
        ) : (
          <div className="no-data">
            <h3>No customers found</h3>
            <p>Once users complete a payment, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;