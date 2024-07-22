import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [signupData, setSignupData] = useState({});
  const router = useRouter();

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
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSignupSubmit}>
        <input type="text" name="firstName" placeholder="First Name" required />
        <input type="text" name="lastName" placeholder="Last Name" required />
        <input type="text" name="phone" placeholder="Phone" required />
        <input type="text" name="username" placeholder="Username" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Signup'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      {otpSent && (
        <div>
          <h2>Verify OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleOtpSubmit}>Verify OTP</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Signup;
