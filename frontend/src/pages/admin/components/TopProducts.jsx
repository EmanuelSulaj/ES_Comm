import React, { useState } from 'react';
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
          {products && products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id}>
                <td className="text-left" style={{ fontWeight: '500' }}>
                  {product.name}
                </td>
                <td className="text-left" style={{ color: '#64748b' }}>
                  {product.categoryName || 'General'}
                </td>
                <td className="text-center" style={{ fontWeight: '600' }}>
                  {product.sold}
                </td>
                <td className="text-right" style={{ color: '#10b981', fontWeight: 'bold' }}>
                  ${product.revenue?.toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                No sales data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  ); 
}

export default TopProducts;