import React from 'react';

const Signup = () => {
  return (
    <div>
      <h1>Signup</h1>
      <form method="POST" action="/api/signup">
        <input type="text" name="firstName" placeholder="First Name" required />
        <input type="text" name="lastName" placeholder="Last Name" required />
        <input type="text" name="phone" placeholder="Phone" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
