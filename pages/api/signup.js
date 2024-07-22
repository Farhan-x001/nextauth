// pages/api/signup.js
import dbConnect from '../../lib/dbconnect';
import User from '../../models/User';
import transporter from '../../lib/mailer';
import crypto from 'crypto';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { firstName, lastName, phone, email, password, confirmPassword, username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists. Please log in.' });
      }

      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ error: 'Username already taken' });
      }

      // Generate OTP and expiry
      const otp = crypto.randomBytes(3).toString('hex');
      const newUser = new User({
        firstName,
        lastName,
        phone,
        email,
        username,
        password, // Store plain text password
        otp,
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
        isVerified: false,
      });

      await newUser.save();

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Email Verification',
        text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
      };

      try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Signup successful. Please check your email for OTP verification.' });
      } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending email' });
      }
    } catch (error) {
      console.error('Signup Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
