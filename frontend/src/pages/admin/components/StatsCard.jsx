import React from 'react';



function StatsCard({ icon, title, value, change = {}, iconBackground = '#10b981' }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: iconBackground }}>
        {icon}
      </div>
      <div className="stat-info">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
       
        <p className={`stat-change ${change?.type || 'positive'}`}>
          {change?.text || 'No data'}
        </p>
      </div>
    </div>
  );
}

export default StatsCard;