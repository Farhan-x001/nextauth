// lib/mongodb.js
import { MongoClient } from 'mongodb';

const clientPromise = MongoClient.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default clientPromise;
