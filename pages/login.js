import { useRouter } from 'next/router';
import { setCookie } from 'nookies';

const Login = () => {
  const router = useRouter();

  const handleSignup = () => {
    router.push('/signup');
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const { token } = await response.json();
        setCookie(null, 'token', token, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
        });
        router.push('/dashboard'); // Redirect to dashboard
      } else {
        const errorText = await response.text();
        alert(errorText);
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>API-Driven Financial Data Aggregator</h1>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Login</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ marginBottom: '10px' }}>
          Email:
          <input type="email" name="email" required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', marginTop: '5px' }} />
        </label>
        <label style={{ marginBottom: '20px' }}>
          Password:
          <input type="password" name="password" required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', marginTop: '5px' }} />
        </label>
        <button type="submit" style={{ backgroundColor: '#0070f3', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px' }}>Login</button>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <span style={{ color: '#666' }}>If not registered, please </span>
          <button 
            type="button" 
            onClick={handleSignup} 
            style={{ background: 'none', color: '#0070f3', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
