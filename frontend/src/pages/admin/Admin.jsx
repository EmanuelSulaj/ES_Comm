import { useState, useEffect, lazy, Suspense } from 'react';
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
  const [activeSection, setActiveSection] = useState('dashboard');
  const [productsSubmenuOpen, setProductsSubmenuOpen] = useState(false);

  useEffect(() => {
    if (activeSection === 'product-list' || activeSection === 'categories') {
      setProductsSubmenuOpen(true);
    }
  }, [activeSection]);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard />;
      case 'product-list': return <ProductList />;
      case 'add-product': return <AddProduct setActiveSection={setActiveSection} />;
      case 'categories': return <Categories />;
      case 'sales': return <SalesAnalytics />;
      case 'customers': return <Customers />;
      case 'inventory': return <Inventory />;
      case 'notifications': return <ComingSoon title="Notifications center" />;
      case 'settings': return <ComingSoon title="Settings panel" />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="admin-page">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        productsSubmenuOpen={productsSubmenuOpen}
        setProductsSubmenuOpen={setProductsSubmenuOpen}
      />

      <main className="admin-main">
        <Header activeSection={activeSection} />

        <Suspense fallback={null}>
          <div className="admin-content-wrapper">
            {renderContent()}
          </div>
        </Suspense>
      </main>
    </div>
  );
}

export default Admin;
