import connectToDatabase from '../../lib/db';
import User from '../../models/User';
import crypto from 'crypto';

export default async function handler(req, res) {
  await connectToDatabase();
  if (req.method === 'POST') {
    const { email } = req.body;
    try {
      const resetToken = crypto.randomBytes(20).toString('hex');
      await User.findOneAndUpdate({ email }, { resetToken });

      const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
      // Send the reset link via email
      res.send('Check your email for a password reset link.');
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
