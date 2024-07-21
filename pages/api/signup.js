import connectToDatabase from '../../lib/db';
import User from '../../models/User';
import transporter from '../../lib/mailer';
import crypto from 'crypto';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'POST') {
    const { firstName, lastName, phone, email, password, confirmPassword, username } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match');
    }

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).send('User with this email already exists. Please log in.');
      }

      const otp = crypto.randomBytes(3).toString('hex');
      const newUser = new User({
        firstName,
        lastName,
        phone,
        email,
        username,  // Ensure this field is provided
        password,
        otp,
        isVerified: false,
      });

      await newUser.save();

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Email Verification',
        text: `Your OTP is ${otp}.`,
      };

      try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Signup successful. Please check your email for OTP verification.');
      } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
