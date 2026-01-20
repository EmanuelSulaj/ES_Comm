import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#9110b9', '#ef4444'];

function CategoryChart({ data }) {
  return (
    // Ensure this div has a fixed height (e.g., 400px)
    <div className="chart-container" style={{ 
      background: 'white', 
      padding: '20px', 
      borderRadius: '12px', 
      height: '400px', 
      minWidth: '0' // This helps ResponsiveContainer in Grid layouts
    }}>
      <h3 style={{ marginBottom: '10px' }}>Sales by Category</h3>
      
      {/* Set a numeric height or minHeight here to be safe */}
      <ResponsiveContainer width="100%" height="90%" minHeight={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value" // Must match the 'value' key from backend
            nameKey="name"  // Must match the 'name' key from backend
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryChart;