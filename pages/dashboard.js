import { useRouter } from 'next/router'; // Import useRouter
import { parseCookies, destroyCookie } from 'nookies';

const Dashboard = ({ user }) => {
  const router = useRouter(); // Initialize useRouter hook

  const handleLogout = async () => {
    try {
      destroyCookie(null, 'token'); // Remove the token cookie
      router.push('/login'); // Redirect to login page
    } catch (error) {
      console.error('Logout Error:', error); // Handle error
    }
  };

  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>
      {user ? (
        <div>
          <p>Hello, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  const { token } = parseCookies(context);

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const res = await fetch(`${process.env.API_URL}/api/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      return {
        props: {
          user: data.user,
        },
      };
    } else {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}

export default Dashboard;
