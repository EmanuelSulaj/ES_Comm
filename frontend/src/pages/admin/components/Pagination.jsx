import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  indexOfFirstProduct, 
  indexOfLastProduct, 
  totalProducts, 
  onPageChange,
  itemType = 'products'
}) => {
  return (
    <div className="pagination-outside-container">
      <div className="pagination-info">
        Showing {totalProducts > 0 ? indexOfFirstProduct + 1 : 0} to {Math.min(indexOfLastProduct, totalProducts)} of {totalProducts} {itemType}
      </div>
      <div className="pagination-buttons">
        <button 
          className="page-btn" 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button 
            key={i + 1}
            className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button 
          className="page-btn" 
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;