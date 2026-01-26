import React from 'react';
import { useState, useEffect, useRef } from 'react'; 
import AddProductModal from './AddProductModal';
import Pagination from './Pagination';
import { useSearch } from '../../../Context/SearchContext';

function ProductList() {
  const { searchQuery } = useSearch();
  const [products, setProducts] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ category: [] });
  const filterRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1. Define the initial form state
  const initialFormState = {
    name: '',
    description: '',
    price: '',
    offerPrice: '',
    category: 'Women',
    image: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterOpen && filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);


  // 2. Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) return;
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 3. FIX: Define handleCloseModal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditId(null);
    setFormData(initialFormState); // Reset form
  };

  // 4. Handle Edit Button Click
    // 4. Handle Edit Button Click
  const handleEditClick = (product) => {
    setEditId(product._id);
    setIsEditing(true);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      offerPrice: product.offerPrice || '',
      category: product._category,
      image: product.image
    });
    setIsModalOpen(true);
  };

  // 5. UPDATED: Accept finalData as the second argument
const handleSubmit = async (e, finalData) => {
  e.preventDefault();
  
  const url = isEditing 
    ? `http://localhost:5000/api/products/${editId}` 
    : 'http://localhost:5000/api/products';
  
  const method = isEditing ? 'PUT' : 'POST';

  
  try {
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalData), 
    });

    if (response.ok) {
      fetchProducts(); // Refresh the list from the database
      handleCloseModal(); // Close and reset
      alert(isEditing ? "Product updated!" : "Product added!");
    }
  } catch (error) {
    console.error("Submit error:", error);
  }
};

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setProducts(products.filter(item => item._id !== productId));
          alert("Product removed!");
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

const handleCheckboxChange = (categoryName) => {
  setActiveFilters(prev => {
    const isSelected = prev.category.includes(categoryName);
    return {
      ...prev,
      category: isSelected 
        ? prev.category.filter(c => c !== categoryName) 
        : [...prev.category, categoryName]
    };
  });
};

const filteredProducts = products.filter((product) => {
  // Category filter
  const categoryMatch = activeFilters.category.length === 0 || 
    activeFilters.category.includes(product.category?.name);
  
  // Search filter
  const searchMatch = !searchQuery || 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  
  return categoryMatch && searchMatch;
});

// PAGINATION LOGIC
const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
const indexOfLastProduct = currentPage * itemsPerPage;
const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

// Reset to page 1 if filters or search change and current page is out of bounds
useEffect(() => {
  setCurrentPage(1);
}, [activeFilters, searchQuery]);


  return (
  <div className="admin-content">
    <div className="content-header">
      <h1 className="page-title">Products</h1>

      {/* Grouping the filter and the add button together */}
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
          <h4>Filter by Category</h4>
          {/* Extract unique categories from your products list */}
          {[...new Set(products.map(p => p.category?.name))].map(catName => (
            <label key={catName} className="filter-option">
              <input 
                type="checkbox" 
                checked={activeFilters.category.includes(catName)}
                onChange={() => handleCheckboxChange(catName)}
              />
              {catName}
            </label>
          ))}
          <button className="clear-filter-btn" onClick={() => setActiveFilters({category: []})}>
            Reset
          </button>
        </div>
      )}
    </div>

    <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          Add New Product
        </button>
      </div>
    </div>

      <div className="products-table-container">
        <table className="products-table"> 
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th className="actions-header">Actions</th> {/* Add a class here */}
            </tr>
          </thead>
          <tbody>

           {currentProducts.map((product) => (
    <tr key={product._id}>
      <td>
        <img 
          src={product.image || 'https://via.placeholder.com/50'} 
          alt={product.name} 
          className="product-thumbnail"
        />
      </td>
      <td>{product.name}</td>
      <td>{product.category?.name || 'No Category'}</td>
      <td>${product.price}</td>
      <td>{product.status || 'Active'}</td>
      <td className="actions-cell"> 
        <div className="actions-wrapper">
          <button className="action-btn edit" onClick={() => handleEditClick(product)}>
            Edit
          </button>
          <button className="action-btn delete" onClick={() => handleDelete(product._id)}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
        </table>
        </div>

      <div className="pagination-outside-container">
        <Pagination 
      currentPage={currentPage}
      totalPages={totalPages}
      indexOfFirstProduct={indexOfFirstProduct}
      indexOfLastProduct={indexOfLastProduct}
      totalProducts={filteredProducts.length}
      onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
    />
      </div>

      <AddProductModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />
    </div>
  );
}

export default ProductList;