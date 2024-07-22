import connectToDatabase from '../../lib/dbconnect';
import User from '../../models/User';

export default async function handler(req, res) {
  await connectToDatabase();
  if (req.method === 'POST') {
    const { token, newPassword } = req.body;
    try {
      const user = await User.findOneAndUpdate(
        { resetToken: token },
        { password: newPassword, resetToken: null }
      );

      if (user) {
        res.send('Password reset successfully. You can now login with your new password.');
      } else {
        res.status(400).send('Invalid or expired token.');
      }
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
