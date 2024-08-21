import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('dataset'); // Make sure this matches the collection name

    const { page = 1, limit = 100000, category = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = category ? { category } : {}; // Filter by category if provided

    const dataset = await collection.find(query).skip(skip).limit(parseInt(limit)).toArray();
    const total = await collection.countDocuments(query);

    res.status(200).json({ dataset, total });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
