import React from 'react';

const Index = () => {
  return (
    <div>
      <h1>Login</h1>
      <form method="POST" action="/api/login">
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Index;
