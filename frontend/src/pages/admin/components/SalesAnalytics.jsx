import React, { useEffect, useState } from 'react';

const SalesAnalytics = () => {
  const [data, setData] = useState({
    revenueByCat: [],
    topProducts: [],
    recentActivity: []
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
    <div style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '25px', color: '#1e293b' }}>Sales & Inventory Analytics</h2>

      {/* Top Row: Category Distribution */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '30px' 
      }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#64748b' }}>Inventory Value by Category</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {data.revenueByCat.map((cat) => (
            <div key={cat.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '500' }}>{cat.name}</span>
                <span style={{ color: '#10b981' }}>${cat.value.toLocaleString()}</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px' }}>
                <div style={{ 
                  width: `${Math.min((cat.value / 5000) * 100, 100)}%`, // Example scale
                  height: '100%', 
                  backgroundColor: '#10b981', 
                  borderRadius: '4px' 
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Top Products List */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#64748b' }}>Premium Products</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ paddingBottom: '12px' }}>Name</th>
                <th style={{ paddingBottom: '12px' }}>Category</th>
                <th style={{ paddingBottom: '12px' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {data.topProducts.map(p => (
                <tr key={p._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '12px 0' }}>{p.name}</td>
                  <td><span style={{ backgroundColor: '#eff6ff', color: '#3b82f6', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
                    {p.category?.name || 'General'}
                  </span></td>
                  <td style={{ fontWeight: '600' }}>${p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Activity Feed */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#64748b' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {data.recentActivity.map((item, idx) => (
              <div key={item._id} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6', marginTop: '6px' 
                }} />
                <div>
                  <p style={{ margin: 0, fontSize: '0.95rem' }}>
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
    </div>
  );
};

export default SalesAnalytics;