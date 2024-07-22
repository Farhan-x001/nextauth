import dbConnect from '../../lib/dbconnect';
import User from '../../models/User';
import crypto from 'crypto';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    try {
      // Find the user with the provided email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      // Check if the OTP is correct and has not expired
      const isOtpValid = user.otp === otp && !isOtpExpired(user.otpExpiry);

      if (!isOtpValid) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      // Mark the user as verified
      user.isVerified = true;
      user.otp = undefined; // Remove OTP after successful verification
      user.otpExpiry = undefined; // Remove OTP expiry date
      await user.save();

      res.status(200).json({ message: 'Verification successful. You can now log in.' });
    } catch (error) {
      console.error('Verification Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

// Utility function to check if OTP is expired
function isOtpExpired(expiryDate) {
  if (!expiryDate) return true;
  return new Date() > new Date(expiryDate);
}
