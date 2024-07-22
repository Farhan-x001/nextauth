// pages/api/current-user.js
import connectToDatabase from '../../lib/dbconnect';
import User from '../../models/User';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const session = await getSession({ req });

      if (session) {
        const user = await User.findById(session.user.id);

        if (user) {
          res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
          });
        } else {
          res.status(404).send('User not found');
        }
      } else {
        res.status(401).send('Unauthorized');
      }
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
