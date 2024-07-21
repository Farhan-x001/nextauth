import connectToDatabase from '../../lib/db';
import User from '../../models/User';

export default async function handler(req, res) {
  await connectToDatabase();
  if (req.method === 'GET') {
    const { email } = req.query;
    try {
      const user = await User.findOne({ email });
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
