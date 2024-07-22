import React from 'react';
import { useRouter } from 'next/router';

const Verify = () => {
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Registration complete. You can now log in.');
      router.push('/login'); // Redirect to login page
    } else {
      // Handle error
      const errorText = await response.text();
      alert(errorText);
    }
  };

  return (
    <div>
      <h1>Verify Your Email</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="text" name="otp" placeholder="OTP" required />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default Verify;
