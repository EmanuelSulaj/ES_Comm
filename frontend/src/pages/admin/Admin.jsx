import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './Admin.css';

const Dashboard = lazy(() => import('./components/Dashboard'));
const ProductList = lazy(() => import('./components/ProductList'));
const Categories = lazy(() => import('./components/Categories'));
const AddProduct = lazy(() => import('./components/AddProduct'));
const SalesAnalytics = lazy(() => import('./components/SalesAnalytics'));
const Customers = lazy(() => import('./components/Customers'));
const Inventory = lazy(() => import('./components/Inventory'));
const ComingSoon = lazy(() => import('./components/ComingSoon'));

function Admin() {
  const [productsSubmenuOpen, setProductsSubmenuOpen] = useState(false);
  return (
    <div className="admin-page">
      {/* Note: You should update your Sidebar to use <NavLink> 
        instead of setActiveSection 
      */}
      <Sidebar
        productsSubmenuOpen={productsSubmenuOpen}
        setProductsSubmenuOpen={setProductsSubmenuOpen}
      />

      <main className="admin-main">
        <Header />

        <Suspense fallback={<div className="loader">Loading...</div>}>
          <div className="admin-content-wrapper">
            <Routes>
              {/* index means this shows at /admin */}
              <Route index element={<Dashboard />} />
              
              {/* These match the path after /admin/ */}
              <Route path="product-list" element={<ProductList />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="categories" element={<Categories />} />
              <Route path="sales" element={<SalesAnalytics />} />
              <Route path="customers" element={<Customers />} />
              <Route path="inventory" element={<Inventory />} />
              
              <Route path="notifications" element={<ComingSoon title="Notifications center" />} />
              <Route path="settings" element={<ComingSoon title="Settings panel" />} />
              
              {/* Fallback */}
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </Suspense>
      </main>
    </div>
  );
}

export default Admin;
