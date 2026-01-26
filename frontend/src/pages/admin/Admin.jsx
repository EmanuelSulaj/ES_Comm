import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { SearchProvider } from '../../Context/SearchContext';
import { NotificationProvider } from '../../Context/NotificationContext';
import './Admin.css';



const Dashboard = lazy(() => import('./components/Dashboard'));
const ProductList = lazy(() => import('./components/ProductList'));
const Categories = lazy(() => import('./components/Categories'));
const AddProduct = lazy(() => import('./components/AddProduct'));
const SalesAnalytics = lazy(() => import('./components/SalesAnalytics'));
const Customers = lazy(() => import('./components/Customers'));
const Inventory = lazy(() => import('./components/Inventory'));
const Notifications = lazy(() => import('./components/Notifications'));
const ComingSoon = lazy(() => import('./components/ComingSoon'));

function Admin() {
  const [productsSubmenuOpen, setProductsSubmenuOpen] = useState(false);
  const location = useLocation();
  const activeSection = location.pathname.split('/').pop() || 'dashboard';

  return (
    <SearchProvider>
      <NotificationProvider>
        <div className="admin-page">
          <Sidebar
          productsSubmenuOpen={productsSubmenuOpen}
          setProductsSubmenuOpen={setProductsSubmenuOpen}
        />

        <main className="admin-main">
          <Header activeSection={activeSection} />

        <Suspense fallback={<div className="loader">Loading...</div>}>
          <div className="admin-content-wrapper">
            <Routes>
             
              <Route index element={<Dashboard />} />
             
              <Route path="product-list" element={<ProductList />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="categories" element={<Categories />} />
              <Route path="sales" element={<SalesAnalytics />} />
              <Route path="customers" element={<Customers />} />
              <Route path="inventory" element={<Inventory />} />
              
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<ComingSoon title="Settings panel" />} />
              
              
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </Suspense>
      </main>
    </div>
      </NotificationProvider>
    </SearchProvider>
  );
}

export default Admin;
