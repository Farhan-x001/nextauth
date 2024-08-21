import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('dataset');

    // Extract limit from query parameters or set a default value
    const { limit = 100 } = req.query;

    // List of categories to check
    const categories = [
      `es_transportation'`, `es_health'`, `es_food'`, `es_home'`, `es_hotelservices'`,
      `es_hyper'`, `es_leisure'`, `es_otherservice'`, `es_sportsandtoys'`, `es_tech'`,
      `es_travel'`, `es_wellnessandbeauty'`, `es_barsandrestaurants'`, `es_contents'`,
      `es_fashion'`
    ];

    // Aggregate to sum the amount in each category with a limit
    const categorySums = await collection.aggregate([
      { $match: { category: { $in: categories } } }, // Filter to include only specified categories
      { $limit: parseInt(limit) }, // Limit the number of documents processed
      { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } }, // Group by category and sum amounts
      { $sort: { _id: 1 } } // Optional: sort by category
    ]).toArray();

    // Format the response
    const result = categories.reduce((acc, category) => {
      const entry = categorySums.find(c => c._id === category);
      acc[category] = entry ? entry.totalAmount : 0;
      return acc;
    }, {});

    res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
