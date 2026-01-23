import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#9110b9', '#ef4444', '#8b5cf6', '#14b8a6', '#f97316'];

function CategoryChart({ data }) {
  return (
   
    <div className="chart-container" style={{ 
      background: 'white', 
      padding: '20px', 
      borderRadius: '12px', 
      height: '400px', 
      minWidth: '0' 
    }}>
      <h3 style={{ marginBottom: '10px' }}>Sales by Category</h3>
      
     
      <ResponsiveContainer width="100%" height="90%" minHeight={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value" 
            nameKey="name"  
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