import React from 'react';
import './TopProducts.css';

function TopProducts({ products = [] }) {
  return (
    <div className="top-products-card">
      <div className="card-header">
        <h3>Top Selling Products</h3>
      </div>

      <table>
        <thead>
          <tr>
            
            <th className="text-left">Product</th>
            <th className="text-left">Category</th>
            <th className="text-center">Sold</th>
            <th className="text-right">Revenue</th>
          </tr>
        </thead>

        <tbody>
          {products.map((item, index) => (
            <tr key={item.id || index}>
              {/* Data matches header alignment */}
              <td className="text-left product-name">{item.name}</td>
              <td className="text-left category-text">{item.category}</td>
              <td className="text-center">
                <span className="badge sold-badge">{item.totalSold}</span>
              </td>
              <td className="text-right">
                <span className="badge revenue-badge">
                  ${item.revenue.toLocaleString()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TopProducts;