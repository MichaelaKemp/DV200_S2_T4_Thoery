require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mysql = require('mysql2'); // Require mysql2 package
const path = require('path'); // To serve static files
const url = require('url'); // To parse the database URL

const app = express();
const PORT = process.env.PORT || 3001; // Use Heroku's port or default to 3001

// Use CORS to allow cross-origin requests
app.use(cors({
  origin: '*', // Allow requests from any origin (for now)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));
app.use(express.json()); // Parse incoming JSON requests

// Parse the JawsDB connection URL
const dbUrl = 'mysql://pjhprxukssvt0z0s:wcdi1gggecx6lxny@k9xdebw4k3zynl4u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/hemqi27lta38v17n';
const dbParams = new url.URL(dbUrl);

// Set up MySQL connection using JawsDB
const db = mysql.createConnection({
  host: dbParams.hostname,
  user: dbParams.username,
  password: dbParams.password,
  database: dbParams.pathname.replace('/', ''), // Extract the database name
  port: dbParams.port || 3306, // Use port from URL or default to 3306
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error('Failed to connect to MySQL:', err);
    return;
  }
  console.log('Connected to JawsDB MySQL database.');

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

// Serve static files from the frontend's build folder
app.use(express.static(path.resolve(__dirname, 'superhero-frontend/build')));



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

// Catch-all route to serve the frontend for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'superhero-frontend/build', 'index.html'));
});


// Start the server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});