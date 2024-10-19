require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mysql = require('mysql2'); // Require mysql2 package
const path = require('path'); // To serve static files
const url = require('url'); // To parse the database URL

const app = express();
const PORT = process.env.PORT || 3001; // Use Heroku's port or default to 3001
const heroCache = new Map();

// Use CORS middleware with additional options
app.use(cors({
  origin: 'https://nameless-temple-24409.herokuapp.com', // Restrict to your frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Headers'],
  credentials: true,
}));

// Enable preflight requests for all routes
// app.options('*', (req, res) => {
//   res.header('Access-Control-Allow-Origin', 'https://nameless-temple-24409.herokuapp.com');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Allow-Headers');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.sendStatus(200);
// });

// Parse incoming JSON requests
app.use(express.json()); 

// Parse the JawsDB connection URL
const dbUrl = process.env.JAWSDB_URL || 'your-default-mysql-url';
const dbParams = new url.URL(dbUrl);

// Set up MySQL connection pool using JawsDB
const db = mysql.createPool({
  host: dbParams.hostname,
  user: dbParams.username,
  password: dbParams.password,
  database: dbParams.pathname.replace('/', ''), // Extract the database name
  port: dbParams.port || 3306, // Use port from URL or default to 3306
  connectionLimit: 10, // Maximum number of connections in the pool
});

// Test the database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Failed to connect to MySQL:', err);
    return;
  }
  console.log('Connected to JawsDB MySQL database.');
  connection.release(); // Release the connection back to the pool
});

// Serve static files from the frontend's build folder
app.use(express.static(path.join(__dirname, 'superhero-frontend', 'build')));

// Cache for heroes
let cachedHeroes = [];

// Function to fetch heroes by letter and add them to the cache
const fetchHeroesByLetter = async (letter) => {
  try {
    const apiKey = process.env.SUPERHERO_API_KEY; // Load API key from .env file
    const allHeroesUrl = `https://superheroapi.com/api/${apiKey}/search/${letter}`;
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

// Function to populate cache with heroes
const initializeHeroCache = async () => {
  const lettersToFetch = 'abcdefghijklmnopqrstuvwxyz'.split('');
  await Promise.all(lettersToFetch.map(letter => fetchHeroesByLetter(letter)));
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

    // Filter heroes by alignment if specified
    const filteredHeroes = alignment
      ? cachedHeroes.filter((hero) => hero.biography.alignment && hero.biography.alignment.toLowerCase() === alignment.toLowerCase())
      : cachedHeroes;

    res.json(filteredHeroes);
  } catch (error) {
    console.error('Error fetching heroes:', error.message);
    res.status(500).json({ message: 'Error fetching heroes.' });
  }
});

// API endpoint to search superheroes by name
app.get('/api/superhero', async (req, res) => {
  const heroName = req.query.name?.toLowerCase();
  if (!heroName) {
    return res.status(400).json({ message: 'Please provide a superhero name.' });
  }

  try {
    const matchingHeroes = cachedHeroes.filter(hero =>
      hero.name.toLowerCase().includes(heroName)
    );

    if (matchingHeroes.length > 0) {
      res.json(matchingHeroes);
    } else {
      res.status(404).json({ message: `No superhero found with name: ${heroName}` });
    }
  } catch (error) {
    console.error('Error fetching superhero by name:', error.message);
    res.status(500).json({ message: 'Error fetching superhero data.' });
  }
});

// API endpoint to fetch superhero by ID
app.get('/api/superhero/:id', async (req, res) => {
  const heroId = req.params.id;

  // Check if hero data is already cached
  if (heroCache.has(heroId)) {
    return res.json(heroCache.get(heroId));
  }

  try {
    const apiKey = process.env.SUPERHERO_API_KEY;
    const heroUrl = `https://superheroapi.com/api/${apiKey}/${heroId}`;
    const response = await axios.get(heroUrl);

    if (response.data && response.data.response === 'success') {
      heroCache.set(heroId, response.data); // Cache the hero data
      res.json(response.data);
    } else {
      res.status(404).json({ message: `No superhero found with ID: ${heroId}` });
    }
  } catch (error) {
    console.error('Error fetching superhero details:', error.message);
    res.status(500).json({ message: 'Error fetching superhero data.' });
  }
});

// Feedback API endpoint
app.post('/api/feedback', (req, res) => {
  console.log('Feedback API called'); // Check if the endpoint is being hit
  const { name, surname, email, message } = req.body;
  console.log('Received data:', { name, surname, email, message }); // Log the received data

  if (!name || !surname || !email || !message) {
    console.log('Validation failed: missing fields');
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Insert the feedback into the MySQL database
  const query = 'INSERT INTO feedback (name, surname, email, message) VALUES (?, ?, ?, ?)';
    db.execute(query, [name, surname, email, message], (err, result) => {
      if (err) {
        console.error('Error saving feedback:', err);
        return res.status(500).json({ message: 'Error saving feedback.' });
      }
      res.status(201).json({ message: 'Feedback submitted successfully.' });
  });
});

// Catch-all route to serve the frontend for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'superhero-frontend', 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});