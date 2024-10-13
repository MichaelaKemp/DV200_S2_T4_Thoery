require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mysql = require('mysql2'); // Require mysql2 package

const app = express();
const PORT = 3001;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests

// Set up MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Use your MySQL username
  password: '', // Leave blank if you don't have a password
  database: 'superhero_hub', // Your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Failed to connect to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database.');

  // Create the feedback table if it doesn't exist
  const createFeedbackTable = `
    CREATE TABLE IF NOT EXISTS feedback (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      surname VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      message TEXT NOT NULL
    )
  `;

  db.query(createFeedbackTable, (err, result) => {
    if (err) {
      console.error('Failed to create feedback table: ', err);
    } else {
      console.log('Feedback table created or already exists.');
    }
  });
});

// Cache for heroes
let cachedHeroes = [];

// Function to fetch heroes by letter and add them to the cache
const fetchHeroesByLetter = async (letter) => {
  try {
    const apiKey = process.env.SUPERHERO_API_KEY; // Load API key from .env file
    const allHeroesUrl = `https://superheroapi.com/api/${apiKey}/search/${letter}`; // Use the API key in the request URL
    console.log(`Fetching heroes starting with letter: ${letter}`);
    const response = await axios.get(allHeroesUrl);

    if (response.data.results && response.data.results.length > 0) {
      response.data.results.forEach((hero) => {
        if (!cachedHeroes.some(cachedHero => cachedHero.id === hero.id)) {
          cachedHeroes.push(hero); // Only add unique heroes to the cache
        }
      });
      console.log(`Cached heroes after fetching letter ${letter}: ${cachedHeroes.length} heroes.`);
    }
  } catch (error) {
    console.error(`Error fetching heroes for letter ${letter}:`, error.response?.data || error.message);
  }
};

// Function to populate cache with heroes (modify to load more letters if needed)
const initializeHeroCache = async () => {
  const lettersToFetch = ['a', 'b', 'c', 'd']; // Fetch heroes for letters a, b, c, d
  for (const letter of lettersToFetch) {
    await fetchHeroesByLetter(letter);
  }
};

// API endpoint to fetch all heroes
app.get('/api/heroes', async (req, res) => {
  try {
    const { alignment } = req.query;

    // If cache is empty, initialize it by fetching heroes
    if (cachedHeroes.length === 0) {
      console.log('Cache is empty, initializing hero cache...');
      await initializeHeroCache();
    }

    const filteredHeroes = alignment
      ? cachedHeroes.filter((hero) => hero.biography.alignment && hero.biography.alignment.toLowerCase() === alignment.toLowerCase())
      : cachedHeroes;

    res.json(filteredHeroes);
  } catch (error) {
    console.error('Error fetching heroes:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error fetching heroes.', error: error.response?.data || error.message });
  }
});

// API endpoint to fetch superhero by ID
app.get('/api/superhero/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const apiKey = process.env.SUPERHERO_API_KEY; // Use the API key from your .env file
    const response = await axios.get(`https://superheroapi.com/api/${apiKey}/${id}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching hero details.' });
  }
});

// API endpoint to fetch superhero by name
app.get('/api/superhero', async (req, res) => {
  const heroName = req.query.name;
  console.log('Received request to fetch superhero with name:', heroName);

  if (!heroName) {
    return res.status(400).json({ message: 'Please provide a superhero name.' });
  }

  try {
    const apiKey = process.env.SUPERHERO_API_KEY; // Use the API key from .env file
    const searchUrl = `https://superheroapi.com/api/${apiKey}/search/${heroName}`; // Use the API key in the request URL
    const response = await axios.get(searchUrl);

    if (response.data.results && response.data.results.length > 0) {
      res.json(response.data.results);
    } else {
      res.status(404).json({ message: `No superhero found with name: ${heroName}` });
    }
  } catch (error) {
    console.error('Error fetching superhero by name:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error fetching superhero data.' });
  }
});

// API endpoint to submit feedback
app.post('/api/feedback', (req, res) => {
  const { name, surname, email, message } = req.body;

  if (!name || !surname || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = 'INSERT INTO feedback (name, surname, email, message) VALUES (?, ?, ?, ?)';
  db.query(query, [name, surname, email, message], (err, result) => {
    if (err) {
      console.error('Error inserting feedback:', err);
      return res.status(500).json({ message: 'Error saving feedback.' });
    }
    res.status(200).json({ message: 'Feedback submitted successfully!' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});