// import clientPromise from '../../lib/mongodb';

// export default async function handler(req, res) {
//   const { page = 1, limit = 10 } = req.query;
//   const skip = (parseInt(page) - 1) * parseInt(limit);
//   const limitNumber = parseInt(limit);

//   try {
//     const client = await clientPromise;
//     const db = client.db();
//     const collection = db.collection('dataset'); // Access the 'dataset' collection

//     const data = await collection.find({})
//       .skip(skip)
//       .limit(limitNumber)
//       .toArray();

//     const total = await collection.countDocuments(); // Get the total number of documents

//     res.status(200).json({
//       dataset: data,
//       total,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }
// pages/api/getDataset.js
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('dataset'); // Make sure this matches the collection name

    const { page = 1, limit = 100 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const dataset = await collection.find().skip(skip).limit(parseInt(limit)).toArray();
    const total = await collection.countDocuments();

    res.status(200).json({ dataset, total });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
