import dbConnect from '../../lib/dbconnect';
import User from '../../models/User';
import crypto from 'crypto';
import transporter from '../../lib/mailer';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      // Check if the user exists
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      // Generate OTP and expiry time
      const otp = crypto.randomBytes(3).toString('hex');
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

      // Update user with OTP and expiry
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();

      // Send OTP via email
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
      };

      try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent to your email.' });
      } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending OTP' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
