// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import mongoose from 'mongoose';
// import User from '../../../models/User';
// import bcrypt from 'bcrypt';
// import dbConnect from '../../../lib/dbConnect';

// export default NextAuth({
//   providers: [
//     CredentialsProvider({
//       async authorize(credentials) {
//         await dbConnect();

//         const user = await User.findOne({ email: credentials.email });
//         if (!user) {
//           throw new Error('No user found with the email');
//         }

//         const isMatch = await bcrypt.compare(credentials.password, user.password);
//         if (!isMatch) {
//           throw new Error('Invalid password');
//         }

//         return { id: user._id, email: user.email };
//       }
//     })
//   ],
//   pages: {
//     signIn: '/login',
//     signOut: '/login'
//   },
//   session: {
//     jwt: true,
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user = { id: token.id, email: token.email };
//       return session;
//     }
//   }
// });
// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: '/auth/signin',
  },
});

