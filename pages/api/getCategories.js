// Example Express route handler for fetching categories

app.get('/api/getCategories', async (req, res) => {
    try {
      const categories = await Dataset.distinct('category');
      res.json({ categories });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });
  