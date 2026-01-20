import React, { useState, useEffect } from 'react';

const EditCategoryModal = ({ isOpen, onClose, category, onUpdate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Sync state when category prop changes
  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || "");
    }
  }, [category]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onUpdate(name, description);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation prevents modal from closing when clicking inside the white box */}
      <div className="center-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Bar matching your reference exactly */}
        <div className="modal-top-bar">
          <span>Edit Category</span>
          <button className="close-x" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          {/* Form Grouping for consistent spacing */}
          <div style={{ padding: '20px 0' }}>
            <div className="form-input-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Category Name
              </label>
              <input 
                type="text" 
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>

            <div className="form-input-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Description
              </label>
              <textarea 
                rows="4"
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', resize: 'none' }}
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
          </div>

          {/* Action Buttons - Usually placed at the bottom right */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '12px', 
            borderTop: '1px solid #eee', 
            paddingTop: '20px' 
          }}>
            <button className="btn-secondary" onClick={onClose} type="button">
              Cancel
            </button>
            <button 
              className="btn-primary" 
               onClick={() => onUpdate(name, description)} // Pass the variables here!
                >
                Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;