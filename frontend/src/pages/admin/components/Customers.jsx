import React, { useEffect, useState } from 'react';
import Pagination from './Pagination';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const handleViewHistory = async (userId) => {
    setModalLoading(true);
    setShowModal(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/customer-orders/${userId}`);
      const data = await response.json();
      setSelectedOrders(data);
    } catch (error) {
      console.error("History fetch error:", error);
    } finally {
      setModalLoading(false);
    }
  };
  

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/customers-report');
        const data = await response.json();
        
        setCustomers(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  
  const cardsPerPage = 8;
  const totalProducts = customers.length;
  const totalPages = Math.ceil(totalProducts / cardsPerPage);
  
  const indexOfLastProduct = currentPage * cardsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - cardsPerPage;
  
  const currentCustomers = customers.slice(indexOfFirstProduct, indexOfLastProduct);
  
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

              <button className="btn-details"
              onClick={() => handleViewHistory(customer._id)}>View Full History</button>
            </div>
          ))
        ) : (
          <div className="no-data">
            <h3>No customers found</h3>
            <p>Once users complete a payment, they will appear here.</p>
          </div>
        )}
      </div>

      {customers.length > 0 && (
        <div style={{ marginTop: '80px' }}>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          indexOfFirstProduct={indexOfFirstProduct}
          indexOfLastProduct={indexOfLastProduct}
          totalProducts={customers.length}
          onPageChange={setCurrentPage}
          itemType='customers'
        />
        </div>
      )}
{/* --- HISTORY MODAL --- */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order History</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              {modalLoading ? (
                <div className="modal-loader">Loading orders...</div>
              ) : selectedOrders.length > 0 ? (
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrders.map((order) => (
                      <tr key={order._id}>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          {/* Map through your orderItems schema */}
                          {order.orderItems.map(item => (
                            <div key={item._id} style={{fontSize: '0.85rem'}}>
                              {item.qty}x {item.name}
                            </div>
                          ))}
                        </td>
                        <td>${order.totalAmount?.toFixed(2)}</td>
                        <td>
                          <span className={`status-pill ${order.paymentStatus?.toLowerCase()}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-history">
                  <p>No order history found for this customer.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div> 
  );
};

export default Customers;