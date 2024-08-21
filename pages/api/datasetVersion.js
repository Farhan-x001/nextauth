import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db(); // No need to specify the database name, it's in the URI
    const collection = db.collection('dataset'); // Access the 'dataset' collection

    // Find the first document with a dataset field
    const dataset = await collection.find({}).limit(10).toArray();

    if (dataset) {
      res.status(200).json(dataset);
    } else {
      res.status(404).json({ error: 'Dataset not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
