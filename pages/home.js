import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Home Page
hi how are u ?

      </h1>
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleLogin} style={{ marginRight: '10px' }}>
          Login
        </button>
        <button onClick={handleSignup}>
          Sign Up
        </button>
      </div>
    </div>
  );
}
