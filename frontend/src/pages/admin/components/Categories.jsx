import React, { useState, useEffect } from "react";
import AddCategoryModal from "./AddCategoryModal"; 
import EditCategoryModal from "./EditCategoryModal";

function Categories() {
  const [categories, setCategories] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

 // 1. Fetch categories from backend on load
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) { console.error("Error fetching:", err); }
  };

  // 2. Updated Add Logic to talk to Backend
  const handleAddCategory = async (categoryData) => {
    try {
      const res = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      
        body: JSON.stringify(categoryData), 
      });

      if (res.ok) {
        fetchCategories(); 
      } else {
        const errorData = await res.json();
        console.error("Server Error:", errorData.message);
      }
    } catch (err) { 
      console.error("Error adding:", err); 
    }
  };

  const handleEditClick = (category) => {
  setEditingCategory(category);
  setIsEditModalOpen(true);
};


const handleUpdateCategory = async (name, description) => { 
  try {
    const response = await fetch(`http://localhost:5000/api/categories/${editingCategory._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name,          
        description    
      }),
    });

    if (response.ok) {
      const updatedCat = await response.json();
      setCategories(categories.map(cat => cat._id === updatedCat._id ? updatedCat : cat));
      setIsEditModalOpen(false);
    }
  } catch (error) {
    console.error("Update error:", error);
  }
};

  // 3. Delete Logic
  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      await fetch(`http://localhost:5000/api/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    }
  };

  return (
    <> 
      <div className="admin-content">
        <div className="content-header">
          <h1>Categories</h1>
     
          <button 
            className="btn-primary" 
            onClick={() => setIsModalOpen(true)}
          >
            Add New Category
          </button>
        </div>
        
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category._id} className="category-card">
              <div className="category-header">
                <h3>{category.name}</h3>
                <div className="category-actions">
                  <button className="action-btn-icon edit"
                   onClick={() => handleEditClick(category)}>Edit</button>
                  <button 
                    className="action-btn-icon delete"
                    onClick={() => handleDelete(category._id)} 
                  >
                  Delete
                  </button>
                </div>
              </div>
              <p className="category-count">{category.count} products</p>
              <div className="category-description">{category.description}</div>
            </div>
          ))}
        </div>
      </div>

    
      <AddCategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddCategory={handleAddCategory}
      />
      <EditCategoryModal 
    isOpen={isEditModalOpen}
    category={editingCategory}
    onClose={() => setIsEditModalOpen(false)}
    onUpdate={handleUpdateCategory}
    />     
    </> 
  );
}

export default Categories; 