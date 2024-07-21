import connectToDatabase from '../../lib/db';
import User from '../../models/User';

export default async function handler(req, res) {
  await connectToDatabase();
  if (req.method === 'POST') {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email, isVerified: true });
      if (user && user.password === password) {
        res.redirect('/dashboard');
      } else {
        res.status(400).send('Invalid email or password');
      }
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
