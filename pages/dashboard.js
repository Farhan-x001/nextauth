import { useRouter } from 'next/router';
import { parseCookies, destroyCookie } from 'nookies';
import { useState, useEffect } from 'react';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import { MenuItem, Select, FormControl, InputLabel, CircularProgress } from '@mui/material';

const Dashboard = ({ user, dataset }) => {
  const router = useRouter();
  const [data, setData] = useState(dataset.dataset || []);
  const [total, setTotal] = useState(dataset.total || 0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([
    `es_transportation'`, `es_health'`, `es_food'`, `es_home'`, `es_hotelservices'`,
    `es_hyper'`, `es_leisure'`, `es_otherservice'`, `es_sportsandtoys'`, `es_tech'`,
    `es_travel'`, `es_wellnessandbeauty'`, `es_barsandrestaurants'`, `es_contents'`,
    `es_fashion'`
  ]);
  const [fraudData, setFraudData] = useState([]);

  const handleShowFraud = () => {
    setShowFraud(true);
    fetchData(1, category, true);
  };

  const handleLogout = async () => {
    try {
      destroyCookie(null, 'token');
      router.push('/login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const fetchData = async (page = 1, category = '') => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/getDataset?page=${page}&limit=100&category=${category}`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setData(data.dataset);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching dataset:', error);
      alert('An error occurred while fetching the dataset.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFraudData = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/categoryCounts?limit=100000');
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setFraudData(Object.entries(data).map(([category, count]) => ({ category, count })));
    } catch (error) {
      console.error('Error fetching fraud data:', error);
      alert('An error occurred while fetching fraud data.');
    }
  };

  useEffect(() => {
    fetchData(page, category);
    fetchFraudData(); // Fetch fraud data on component mount
  }, [page, category]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchData(newPage, category);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1); // Reset to first page when category changes
    fetchData(1, event.target.value);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>Welcome to Your Dashboard</h1>
      {user ? (
        <div style={{ marginBottom: '20px' }}>
          <p>Hello, {user.username}!</p>
          <button 
            onClick={handleLogout} 
            style={{ backgroundColor: '#0070f3', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}

      <h2 style={{ marginTop: '20px', marginBottom: '10px' }}>Filter by Category</h2>
      <FormControl fullWidth variant="outlined" style={{ marginBottom: '20px' }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          onChange={handleCategoryChange}
          label="Category"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          {categories.map(cat => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <h2 style={{ marginTop: '20px', marginBottom: '10px' }}>Your Dataset</h2>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr>
                {['Step', 'Customer', 'Age', 'Gender', 'Zipcode Origin', 'Merchant', 'Zip Merchant', 'Category', 'Amount', 'Fraud'].map((header) => (
                  <th key={header} style={{ borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((record) => (
                  <tr key={record._id}>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{record.step}</td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{record.customer}</td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{record.age}</td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{record.gender}</td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{record.zipcodeOri}</td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{record.merchant}</td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{record.zipMerchant}</td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{record.category}</td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{record.amount}</td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{record.fraud}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '10px' }}>No data available</td>
                </tr>
              )}
            </tbody>
          </table>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              onClick={() => handlePageChange(page - 1)} 
              disabled={page === 1}
              style={{ backgroundColor: '#0070f3', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}
            >
              Previous
            </button>
            <span>Page {page} of {Math.ceil(total / 10)}</span>
            <button 
              onClick={() => handlePageChange(page + 1)} 
              disabled={data.length < 10}
              style={{ backgroundColor: '#0070f3', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}
            >
              Next
            </button>
          </div>

          <h2 style={{ marginTop: '20px', marginBottom: '10px' }}>Charts</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '48%' }}>
              <BarChart data={data} />
            </div>
            <div style={{ width: '48%' }}>
              <PieChart data={data} />
            </div>
          </div>

          <h2 style={{ marginTop: '20px', marginBottom: '10px' }}>Fraud Cases Bar Graph</h2>
          <div style={{ width: '100%' }}>
            <BarChart data={fraudData} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

export async function getServerSideProps(ctx) {
  const cookies = parseCookies(ctx);
  const token = cookies.token;
  if (!token) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const res = await fetch('http://localhost:3001/api/getDataset');
  const dataset = await res.json();

  const user = await fetch('http://localhost:3001/api/user', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json());

  return { props: { user, dataset } };
}
