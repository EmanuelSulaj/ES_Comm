import React, { useEffect, useState } from 'react';

const SalesAnalytics = () => {
  const [data, setData] = useState({
    revenueByCat: [],
    topProducts: [],
    recentActivity: [],
    recentPurchases: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/sales/dashboard');
        const json = await res.json();
        setData(json); 
        setLoading(false);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading Analytics...</div>;

  return (
    
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', width: '100%' }}>
      

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px' 
      }}>
        
        <h2 style={{ marginBottom: '30px', color: '#1e293b', fontWeight: '700' }}>
          Sales & Inventory Analytics
        </h2>

        {/* SECTION 1: Category Bars */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          marginBottom: '30px' 
        }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '20px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Inventory Value by Category
          </h3>
          
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '25px' 
          }}>
            {data.revenueByCat?.map((cat) => (
              <div key={cat.name} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#334155' }}>{cat.name}</span>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>
                    {/* Add ? here too to prevent errors if value is missing */}
                    ${cat.value?.toLocaleString() || '0'}
                  </span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#f1f5f9', borderRadius: '10px' }}>
                  <div style={{ 
                    width: `${Math.min((cat.value / 2000) * 100, 100) || 0}%`, 
                    height: '100%', 
                    backgroundColor: '#10b981', 
                    borderRadius: '10px' 
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

       
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
          gap: '30px' 
        }}>
          
         
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#1e293b' }}>Premium Products</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                  <th style={{ paddingBottom: '12px', color: '#64748b', fontWeight: '600' }}>Name</th>
                  <th style={{ paddingBottom: '12px', color: '#64748b', fontWeight: '600' }}>Category</th>
                  <th style={{ paddingBottom: '12px', color: '#64748b', fontWeight: '600', textAlign: 'right' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.map(p => (
                  <tr key={p._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '16px 0', fontWeight: '500' }}>{p.name}</td>
                    <td>
                      <span style={{ backgroundColor: '#eff6ff', color: '#3b82f6', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>
                        {p.category?.name || 'General'}
                      </span>
                    </td>
                    <td style={{ fontWeight: '700', textAlign: 'right', color: '#1e293b' }}>${p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Activity Feed */}
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#1e293b' }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {data.recentActivity.map((item) => (
                <div key={item._id} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    minWidth: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6', marginTop: '6px' 
                  }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#334155' }}>
                      <strong>{item.name}</strong> was added to inventory
                    </p>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      Category: {item.category?.name} • ${item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
        {/* SECTION 3: Recent Purchases (Full Width) */}
    <div style={{ marginTop: '40px', backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#1e293b' }}>Last 5 Purchases</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                <th style={{ paddingBottom: '12px', color: '#64748b' }}>Order ID</th>
                <th style={{ paddingBottom: '12px', color: '#64748b' }}>Customer</th>
                <th style={{ paddingBottom: '12px', color: '#64748b' }}>Status</th>
                <th style={{ paddingBottom: '12px', color: '#64748b', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              
               {(data.recentPurchases || []).slice(0, 5).map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '16px 0', color: '#64748b', fontSize: '0.85rem' }}>#{order._id.slice(-6).toUpperCase()}</td>
                  <td style={{ fontWeight: '600' }}>{order.user?.username || 'Guest'}</td>
                  <td>
                    <span style={{ 
                      backgroundColor: '#dcfce7', color: '#166534', 
                      padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' 
                    }}>
                      Completed
                    </span>
                  </td>
                  <td style={{ fontWeight: '700', textAlign: 'right' }}>${order.totalAmount?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default SalesAnalytics;