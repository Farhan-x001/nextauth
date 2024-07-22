// pages/api/verify-otp.js
import dbConnect from '../../lib/dbconnect';
import User from '../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
      }

      if (user.otpExpiry < new Date()) {
        return res.status(400).json({ error: 'OTP has expired' });
      }

      user.isVerified = true;
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      res.status(200).json({ message: 'OTP verified successfully. You can now log in.' });
    } catch (error) {
      console.error('Verification Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
