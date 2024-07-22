// pages/api/auth/login.js
import { connectToDatabase } from '../../../lib/dbconnect'; // Ensure this path is correct
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const { db } = await connectToDatabase();

    // Ensure your collection name matches your MongoDB setup
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(401).json({ message: 'User not found' });
    }

    // Assuming user.password is hashed
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Invalid credentials');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET, // Ensure this is set in your environment variables
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
