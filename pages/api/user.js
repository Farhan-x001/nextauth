import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authorization.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
