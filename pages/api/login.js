import dbConnect from '../../lib/dbconnect';
import User from '../../models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      // Find the user by email
      const user = await User.findOne({ email });

      // Check if user exists
      if (!user) {
        console.log('User not found');
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Log the user password and entered password
      console.log('Entered password:', password);
      console.log('Stored password:', user.password);

      // Verify the password (plain text comparison)
      if (password !== user.password) {
        console.log('Password mismatch');
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Check if the account is verified
      if (!user.isVerified) {
        console.log('Account not verified');
        return res.status(401).json({ error: 'Account is not verified' });
      }

      // Create a JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Respond with the token and user info
      res.status(200).json({ token, user: { username: user.username, isVerified: user.isVerified } });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
