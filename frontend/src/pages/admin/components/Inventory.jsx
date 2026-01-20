import React, { useEffect, useState } from 'react';
import './Inventory.css';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        // Ensure every product has a stock field
        const normalized = data.map(p => ({ stock: 0, ...p }));
        setProducts(normalized);
      } catch (err) {
        console.error('Failed to load inventory', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  
  const updateStock = async (id, amount) => {
    try {
      await fetch(`http://localhost:5000/api/inventory/${id}/adjust`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });

      setProducts(prev =>
        prev.map(p =>
          p._id === id ? { ...p, stock: Math.max(0, (p.stock || 0) + amount) } : p
        )
      );
    } catch (err) {
      console.error('Failed to update stock', err);
    }
  };

  // Set stock to a specific value
  const setStock = async (id) => {
    const value = prompt('Set stock amount:');
    if (value === null) return;

    const stockValue = Number(value);
    if (isNaN(stockValue) || stockValue < 0) {
      alert('Please enter a valid non-negative number');
      return;
    }

    try {
      await fetch(`http://localhost:5000/api/inventory/${id}/adjust`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: stockValue })
      });

      setProducts(prev =>
        prev.map(p =>
          p._id === id ? { ...p, stock: stockValue } : p
        )
      );
    } catch (err) {
      console.error('Failed to set stock', err);
    }
  };

  if (loading) return <p className="admin-loading">Loading inventory...</p>;

  return (
    <div className="admin-page">
      <h2 className="admin-title">Inventory</h2>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Adjust</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td className="product-cell">
                  <img src={product.image} alt={product.name} />
                  <span>{product.name}</span>
                </td>
                <td>{product.category?.name || '—'}</td>
                <td>${product.price}</td>
                <td className={product.stock === 0 ? 'out-of-stock' : ''}>
                  {product.stock}
                </td>
                <td>
                  <button
                    className="stock-btn minus"
                    onClick={() => updateStock(product._id, -1)}
                  >
                    −
                  </button>
                  <button
                    className="stock-btn plus"
                    onClick={() => updateStock(product._id, 1)}
                  >
                    +
                  </button>
                  <button
                    className="stock-btn set"
                    onClick={() => setStock(product._id)}
                  >
                    Set
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
