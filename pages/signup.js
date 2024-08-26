import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [signupData, setSignupData] = useState({});
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Client-side validation for password and confirm password
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    setSignupData(data); // Save the data for final submission

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setOtpSent(true);
      } else {
        const errorText = await response.text();
        setError(errorText);
      }
    } catch (error) {
      console.error('Signup Error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupData.email, otp }),
      });

      if (response.ok) {
        alert('Signup successful. You can now log in.');
        router.push('/login');
      } else {
        const errorText = await response.text();
        setError(errorText);
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Signup</h1>
      <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <input type="text" name="firstName" placeholder="First Name" required style={{ marginBottom: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <input type="text" name="lastName" placeholder="Last Name" required style={{ marginBottom: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <input type="text" name="phone" placeholder="Phone" required style={{ marginBottom: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <input type="text" name="username" placeholder="Username" required style={{ marginBottom: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <input type="email" name="email" placeholder="Email" required style={{ marginBottom: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <input type="password" name="password" placeholder="Password" required style={{ marginBottom: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" required style={{ marginBottom: '20px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <button type="submit" disabled={loading} style={{ backgroundColor: '#0070f3', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px' }}>
          {loading ? 'Signing Up...' : 'Signup'}
        </button>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <span style={{ color: '#666' }}>If already registered, please </span>
          <button
            type="button"
            onClick={handleLogin}
            style={{ background: 'none', color: '#0070f3', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Login
          </button>
        </div>
      </form>

      {otpSent && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ textAlign: 'center', color: '#333' }}>Verify OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '10px' }}
          />
          <button onClick={handleOtpSubmit} style={{ backgroundColor: '#0070f3', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>Verify OTP</button>
          {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Signup;
