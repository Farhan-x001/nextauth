import { useRouter } from 'next/router';
import { setCookie } from 'nookies';

const Login = () => {
  const router = useRouter();

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
    <form onSubmit={handleLogin}>
      <label>
        Email:
        <input type="email" name="email" required />
      </label>
      <label>
        Password:
        <input type="password" name="password" required />
      </label>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
