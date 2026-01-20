import React, { useState, useRef, useEffect } from 'react';

// 1. Update the props destructuring to include 'onSubmit', 'formData', 'setFormData', and 'isEditing'
function AddProductModal({ isOpen, onClose, onSubmit, formData, setFormData, isEditing }) {
  
  const fileInputRef = useRef(null);

  // --- ADD THESE CONSTANTS AND USEEFFECT HERE ---
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/categories');
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error loading categories for dropdown:", err);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]); // Only runs when the modal opens
  // ----------------------------------------------

  if (!isOpen) return null;

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image selection and create a preview URL
  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Create the temporary preview URL
    const previewUrl = URL.createObjectURL(file);
    setFormData({ 
      ...formData, 
      image: previewUrl 
    });
  }
};


  const handleSubmitInternal = async (e) => {
  e.preventDefault();

  // Start with the existing image (useful if we are editing and didn't change the photo)
  let imageUrl = formData.image;

  // Check if a NEW file was actually selected in the input
  const file = fileInputRef.current?.files[0];
  
  if (file) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "otfzteyi");

    try {
      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dlrvxzktf/image/upload", {
        method: "POST",
        body: data,
      });
      const cloudData = await cloudRes.json();
      
      // Update our variable with the PERMANENT HTTPS link
      imageUrl = cloudData.secure_url; 
    } catch (error) {
      console.error("Cloudinary upload failed", error);
      alert("Image upload failed. Please try again.");
      return;
    }
  }

  // Send the clean data (with permanent URL) to the parent's onSubmit function
  if (onSubmit) {
    const finalData = { ...formData, image: imageUrl };
    onSubmit(e, finalData); 
  }
};

  return (
  <div className="modal-overlay" onClick={onClose}>
    <div className="center-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-top-bar">
        {/* Dynamic title based on isEditing prop */}
        <span>{isEditing ? 'Edit Product' : 'Add New Product'}</span>
        <button className="close-x" onClick={onClose}>&times;</button>
      </div>
      
      <div className="modal-body">
        <form onSubmit={handleSubmitInternal} className="product-form">
          <div className="form-group">
            <label>Product title</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              placeholder="Type here" 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description"
              value={formData.description}
              placeholder="Type here" 
              onChange={handleChange}
              required 
              rows="2"
              className="modal-textarea"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Price</label>
              <input 
                type="number" 
                name="price"
                value={formData.price}
                placeholder="Type here" 
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label>Offer Price</label>
              <input 
                type="number" 
                name="offerPrice"
                value={formData.offerPrice}
                placeholder="Type here" 
                onChange={handleChange}
              />
            </div>
          </div>

          {/* --- UPDATED DYNAMIC CATEGORY SELECT --- */}
          <div className="form-group">
            <label>Product Category</label>
            <select 
              name="category"
              value={formData.category} 
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}> 
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          

          <div className="form-group">
            <div className="upload-container" onClick={() => fileInputRef.current.click()}>
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="upload-preview" />
              ) : (
                <div className="upload-content">
                  <svg 
                    width="32" height="32" viewBox="0 0 24 24" 
                    fill="none" stroke="#9ca3af" strokeWidth="1.5" 
                    strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="M17.5 19A5.5 5.5 0 0 0 18 8h-1.26A8 8 0 1 0 3 16.3" />
                    <polyline points="13 11 9 15 13 19" />
                    <line x1="9" y1="15" x2="21" y2="15" />
                  </svg>
                  <span className="upload-label">Click to Upload</span>
                </div>
              )}
              <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
              />
            </div>
          </div>

          <div className="modal-footer-right">
            <button type="submit" className="btn-add-large">
              {isEditing ? 'UPDATE' : 'ADD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}
export default AddProductModal;
