import React from 'react';
function ComingSoon({ title }) {
  return (
    <div className="admin-content">
      <div className="content-header">
        <h1>{title}</h1>
      </div>
      <div className="coming-soon">{title} coming soon...</div>
    </div>
  );
}

export default ComingSoon;

