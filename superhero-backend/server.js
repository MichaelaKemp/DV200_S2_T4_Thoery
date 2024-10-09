require('dotenv').config(); // Load environment variables
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors()); // Enable CORS for all routes

// Check if the API key is loaded correctly
if (!process.env.SUPERHERO_API_KEY) {
  console.error('ERROR: Superhero API key is undefined. Make sure .env is correctly configured.');
  process.exit(1); // Exit the app if no API key is loaded
}

// API endpoint to fetch superheroes based on search query
app.get('/api/superheroes', async (req, res) => {
  const searchQuery = req.query.name; // Get the search query from request parameters

  // If no search query is provided, return a 400 error
  if (!searchQuery) {
    return res.status(400).json({ message: 'Please provide a superhero or villain name to search.' });
  }

  try {
    // Build the Superhero API request URL
    const apiUrl = `https://superheroapi.com/api/${process.env.SUPERHERO_API_KEY}/search/${encodeURIComponent(searchQuery)}`;
    console.log('API Request URL:', apiUrl);

    // Fetch data from the Superhero API
    const response = await axios.get(apiUrl);

    // If no results are found, return an error message
    if (response.data.response === 'error') {
      return res.status(404).json({ message: `No superheroes found for search term: ${searchQuery}` });
    }

    // Return the superhero data
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Superhero API:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error fetching data from Superhero API' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});