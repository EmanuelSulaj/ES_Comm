import React, { useEffect, useState } from 'react';
import StatsCard from './StatsCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import SalesChart from './SalesChart';
import CategoryChart from './CategoryChart';
import TopProducts from './TopProducts';
import StockAlert from './StockAlert';
import './Dashboard.css';


function Dashboard() {
  const [data, setData] = useState({ totalSales: 0, customers: 0, orders: 0, products: 0 });
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topProducts, setTopProducts] = useState([]);
  

  useEffect(() => {
  const fetchAllData = async () => {
    try {
      console.log("🚀 Frontend: Fetching all dashboard data...");
      
      const [statsRes, trendRes, categoryRes, topProductsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/dashboard-stats`),
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/sales-trend`),
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/category-distribution`),
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/top-products`)
      ]);

      const statsResult = await statsRes.json();
      const trendResult = await trendRes.json();
      const categoryResult = categoryRes.ok ? await categoryRes.json() : [];
      const topProductResult = await topProductsRes.json();
      
      // DEBUG: Check what data we're receiving
      console.log("🔍 Top Products Response:", topProductResult);
      console.log("🔍 Is it an array?", Array.isArray(topProductResult));
      console.log("🔍 Length:", topProductResult?.length);
      
      setTopProducts(topProductResult);
     
      console.log("📊 Frontend Category Data Received:", categoryResult);

      setData(statsResult);
      setChartData(trendResult);

      if (!categoryResult || categoryResult.length === 0) {
        setCategoryData([{ name: 'No Sales Yet', value: 1 }]);
      } else {
        setCategoryData(categoryResult);
      }

      setLoading(false);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setCategoryData([{ name: 'Error Loading', value: 1 }]);
      setLoading(false);
    }
  };

  fetchAllData();
}, []); 

  const stats = [
    {
      title: 'Total Sales',
      value: `$${data.totalSales.toLocaleString()}`,
      iconBackground: '#10b981',
      change: { text: 'Live revenue', type: 'positive' },
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      )
    },
    {
      title: 'Customers',
      value: data.customers.toLocaleString(),
      iconBackground: '#9110b9',
      change: { text: 'Accounts registered', type: 'positive' },
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      title: 'Orders',
      value: data.orders.toLocaleString(),
      iconBackground: '#f59e0b',
      change: { text: 'Completed', type: 'positive' },
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      )
    },
    {
      title: 'Total Products',
      value: data.products.toLocaleString(),
      iconBackground: '#3b82f6',
      change: { text: 'Items in catalog', type: 'positive' },
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      )
    }
  ];


  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-content">
      <h1>Dashboard Overview</h1>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      
      <div className="charts-main-container">
        <div className="chart-card revenue-trend">
          <SalesChart data={chartData} />
        </div>
        <div className="chart-card category-distribution">
          <CategoryChart data={categoryData} />
        </div>
        <div className="chart-card top-products">
          <TopProducts products={topProducts} />
        </div>
        <div className="chart-card low-stock">
          <StockAlert />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;