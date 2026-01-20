import React, { useState } from 'react';

function AddCategoryModal({ isOpen, onClose, onAddCategory }) {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoryName.trim()) {
      onAddCategory({ name: categoryName, description: categoryDescription });
      setCategoryName(''); 
      setCategoryDescription('');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="center-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top-bar">
          <span>Add New Category</span>
          {/* Bold and Large X for clear exit */}
          <button className="close-x" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Category Name</label>
              <input 
                type="text" 
                placeholder="Enter category name" 
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required 
              />
            </div>

            {/* 3. New Description Field */}
            <div className="form-group" style={{ marginTop: '15px' }}>
              <label>Description</label>
              <textarea 
                placeholder="Enter category description" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="modal-textarea" // Use your existing modal-textarea class
              />
            </div>

            <div className="modal-footer-right">
              <button type="submit" className="btn-add-large">ADD CATEGORY</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCategoryModal;