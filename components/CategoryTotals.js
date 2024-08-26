// components/CategoryTotals.js
import React, { useState, useEffect } from 'react';

const CategoryTotals = () => {
  const [categoryTotals, setCategoryTotals] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryTotals = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/categoryCounts?limit=1000000');
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setCategoryTotals(data);
      } catch (error) {
        console.error('Error fetching category totals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryTotals();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Category Totals</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>Category</th>
            <th style={{ borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(categoryTotals).map(([category, total]) => (
            <tr key={category}>
              <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{category}</td>
              <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>${total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTotals;
