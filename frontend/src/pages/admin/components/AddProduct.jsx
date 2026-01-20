import { useState } from 'react';

function AddProduct({ setActiveSection }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: 'Electronics'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Product added to database!");
        setActiveSection('product-list'); 
      }
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  return (
    <div className="admin-content">
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit} className="add-product-form">
        <input type="text" placeholder="Product Name" required 
          onChange={(e) => setFormData({...formData, name: e.target.value})} />
        
        <input type="number" placeholder="Price" required 
          onChange={(e) => setFormData({...formData, price: e.target.value})} />
        
        <input type="text" placeholder="Image URL (e.g. https://...)" required 
          onChange={(e) => setFormData({...formData, image: e.target.value})} />

        <select onChange={(e) => setFormData({...formData, category: e.target.value})}>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Gadgets">Gadgets</option>
        </select>

        <textarea placeholder="Product Description" required 
          onChange={(e) => setFormData({...formData, description: e.target.value})} />

        <button type="submit" className="submit-btn">Save Product</button>
      </form>
    </div>
  );
}

export default AddProduct;