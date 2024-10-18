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
const corsOptions = {
  origin: 'https://nameless-temple-24409.herokuapp.com', // Your frontend URL on Heroku
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
  credentials: true, // Enable credentials if needed
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable CORS pre-flight for all routes

app.use(express.json()); // Parse incoming JSON requests

// Parse the JawsDB connection URL
const dbUrl = process.env.JAWSDB_URL || 'your-default-mysql-url';
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
});

// Serve static files from the frontend's build folder
app.use(express.static(path.join(__dirname, 'superhero-frontend', 'build')));

// Cache for heroes
let cachedHeroes = [];

// API endpoint to search superheroes by name
app.get('/api/superhero', async (req, res) => {
  const heroName = req.query.name;
  if (!heroName) {
    return res.status(400).json({ message: 'Please provide a superhero name.' });
  }

  try {
    const apiKey = process.env.SUPERHERO_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'API key is missing' });
    }

    const searchUrl = `https://superheroapi.com/api/${apiKey}/search/${heroName}`;
    const response = await axios.get(searchUrl);

    if (response.data.response === "success" && Array.isArray(response.data.results)) {
      res.json(response.data.results); // Send back the list of heroes in JSON format
    } else {
      res.status(404).json({ message: `No superhero found with name: ${heroName}` });
    }
  } catch (error) {
    console.error('Error fetching superhero by name:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error fetching superhero data.' });
  }
});


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

// New API endpoint to fetch superhero by ID
app.get('/api/superhero/:id', async (req, res) => {
  const heroId = req.params.id;
  try {
    const apiKey = process.env.SUPERHERO_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'API key is missing' });
    }

    const heroUrl = `https://superheroapi.com/api/${apiKey}/${heroId}`;
    const response = await axios.get(heroUrl);

    if (response.data && response.data.response === 'success') {
      res.json(response.data); // Send back the hero details in JSON format
    } else {
      res.status(404).json({ message: `No superhero found with ID: ${heroId}` });
    }
  } catch (error) {
    console.error('Error fetching superhero details:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error fetching superhero data.' });
  }
});

// Catch-all route to serve the frontend for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'superhero-frontend', 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});