import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { setCookie, parseCookies, destroyCookie } from 'nookies';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const { token } = parseCookies();

      if (token) {
        try {
          const res = await fetch('/api/user', {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();
            if (data.user.isVerified) {
              setUser(data.user);
              if (router.pathname === '/login' || router.pathname === '/verify') {
                router.push('/dashboard');
              }
            } else {
              destroyCookie(null, 'token');
              setUser(null);
              if (router.pathname !== '/verify') {
                router.push('/verify');
              }
            }
          } else {
            destroyCookie(null, 'token');
            setUser(null);
            if (router.pathname !== '/login' && router.pathname !== '/signup') {
              router.push('/login');
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          destroyCookie(null, 'token');
          setUser(null);
          if (router.pathname !== '/login' && router.pathname !== '/signup') {
            router.push('/login');
          }
        }
      } else {
        setUser(null);
        if (router.pathname !== '/login' && router.pathname !== '/signup') {
          router.push('/login');
        }
      }

      setLoading(false);
    };

    fetchUserData();
  }, [router.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <Component {...pageProps} user={user} />;
}

export default MyApp;
