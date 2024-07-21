import connectToDatabase from '../../lib/db';
import User from '../../models/User';

export default async function handler(req, res) {
  await connectToDatabase();
  if (req.method === 'POST') {
    const { email, otp } = req.body;
    try {
      const user = await User.findOne({ email, otp, isVerified: false });
      if (user) {
        user.isVerified = true;
        user.otp = '';
        await user.save();
        res.redirect('/dashboard');
      } else {
        res.status(400).send('Invalid OTP or email already verified');
      }
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
