// pages/_app.js
import '../styles/globals.css'; // Import global CSS
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Handle authentication or other global logic
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
