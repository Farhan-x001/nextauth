// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>
        <Link href="/signup">
          <a>Go to Signup Page</a>
        </Link>
      </p>
    </div>
  );
}
