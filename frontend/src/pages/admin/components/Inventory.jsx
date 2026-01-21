import React, { useEffect, useState, useRef } from 'react';
import Pagination from './Pagination';
import './Inventory.css';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
const [activeFilters, setActiveFilters] = useState({ 
  category: [], 
  priceRange: 'all', 
  stockStatus: 'all' 
});
const filterRef = useRef(null);


useEffect(() => {
  const handleClickOutside = (event) => {
    if (isFilterOpen && filterRef.current && !filterRef.current.contains(event.target)) {
      setIsFilterOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [isFilterOpen]);


  

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
      
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

// 1. First, calculate the filtered list (You already have this part)
const filteredProducts = products.filter((product) => {
  const categoryMatch = activeFilters.category.length === 0 || 
                        activeFilters.category.includes(product.category?.name);
  
  let stockMatch = true;
  if (activeFilters.stockStatus === 'out') stockMatch = product.stock === 0;
  if (activeFilters.stockStatus === 'low') stockMatch = product.stock > 0 && product.stock <= 5;
  if (activeFilters.stockStatus === 'in') stockMatch = product.stock > 5;

  let priceMatch = true;
  if (activeFilters.priceRange === 'under50') priceMatch = product.price < 50;
  if (activeFilters.priceRange === '50-500') priceMatch = product.price >= 50 && product.price <= 500;
  if (activeFilters.priceRange === 'over500') priceMatch = product.price > 500;

  return categoryMatch && stockMatch && priceMatch;
});


const totalProducts = filteredProducts.length; 
const totalPages = Math.ceil(totalProducts / itemsPerPage);

const validatedCurrentPage = Math.min(currentPage, totalPages || 1);

const indexOfLastProduct = validatedCurrentPage * itemsPerPage;
const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;


const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="admin-page">
      <div className="inventory-header">
        <h2 className="admin-title">Inventory</h2>

      <div className="header-actions">
        <div className="filter-wrapper" ref={filterRef}>
          <button 
            className="filter-icon-btn" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span>Filter</span>
          </button>

    {isFilterOpen && (
      <div className="filter-dropdown-menu">
        {/* Category Section */}
        <h4>Category</h4>
        {[...new Set(products.map(p => p.category?.name))].filter(Boolean).map(cat => (
          <label key={cat} className="filter-option">
            <input 
              type="checkbox" 
              checked={activeFilters.category.includes(cat)}
              onChange={() => {
                const isSelected = activeFilters.category.includes(cat);
                setActiveFilters({
                  ...activeFilters,
                  category: isSelected 
                    ? activeFilters.category.filter(c => c !== cat) 
                    : [...activeFilters.category, cat]
                });
              }}
            /> {cat}
          </label>
        ))}

        {/* Stock Status Section */}
        <h4>Stock Status</h4>
        <select 
          value={activeFilters.stockStatus} 
          onChange={(e) => setActiveFilters({...activeFilters, stockStatus: e.target.value})}
        >
          <option value="all">All Items</option>
          <option value="in">In Stock ({">"}5)</option>
          <option value="low">Low Stock (1-5)</option>
          <option value="out">Out of Stock</option>
        </select>

        <button className="clear-filter-btn" onClick={() => setActiveFilters({ category: [], priceRange: 'all', stockStatus: 'all' })}>
          Reset Filters
        </button>
      </div>
    )}
    </div>
  </div>
</div>

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
            {currentProducts.map(product => (
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
      <div className="pagination-outside-wrapper">
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          indexOfFirstProduct={indexOfFirstProduct}
          indexOfLastProduct={indexOfLastProduct}
          totalProducts={totalProducts}
          onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
        />
      </div>
    </div>
  );
}
export default Inventory;
