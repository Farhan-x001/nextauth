import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('dataset');

    // Aggregate to get fraud counts for the `es_transportation'` category with limiting
    const fraudCount = await collection.aggregate([
      { $match: { category: 'es_transportation\'', fraud: 1 } }, // Filter by the specific category and fraud cases
      { $group: { _id: "$category", count: { $sum: 1 } } }, // Group by category and count occurrences
      { $limit: 1 } // Limit the result to 1 (not necessary but can help in some scenarios)
    ]).toArray();

    if (fraudCount.length === 0) {
      return res.status(404).json({ message: 'No fraud cases found for this category' });
    }

    res.status(200).json(fraudCount[0]); // Return the first result as the count for the category
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
