import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import the Link component for navigation
import fallbackImage from '../assets/user_icon.png'; // Import the fallback image
import Layout from './Layout'; // Import the Layout component
import './Characters.css';

const Characters = () => {
  const [searchQuery, setSearchQuery] = useState(''); // Search input for hero name
  const [heroes, setHeroes] = useState([]); // Stores the hero data
  const [error, setError] = useState('');
  const [alignment, setAlignment] = useState(''); // Selected alignment
  const navigate = useNavigate(); // React Router's navigate hook

  // Fetch all heroes when the component is first mounted
  useEffect(() => {
    fetchAllHeroes();
  }, []);

  // Fetch all heroes from the API
  const fetchAllHeroes = async () => {
    try {
      const result = await axios.get('http://nameless-temple-24409.herokuapp.com/api/heroes'); // Adjust API endpoint if needed
      const sortedHeroes = result.data.sort((a, b) => a.name.localeCompare(b.name)); // Sort heroes alphabetically by name
      console.log('Total Heroes Fetched:', sortedHeroes.length); // Log the number of heroes fetched
      setHeroes(sortedHeroes);
      setError('');
    } catch (err) {
      console.error('Error fetching heroes:', err.response?.data || err.message);
      setError('Unable to fetch heroes. Please try again later.');
    }
  };

  // Function to handle alignment selection and filter the current list of heroes
  const handleAlignmentChange = (e) => {
    const selectedAlignment = e.target.value;
    setAlignment(selectedAlignment);
    filterHeroes(searchQuery, selectedAlignment); // Apply filtering on both search and alignment
  };

  // Handle search by hero name
  const handleSearch = async (e) => {
    e.preventDefault();
    filterHeroes(searchQuery, alignment); // Apply filtering on both search and alignment
  };

  // Function to filter heroes by search query and alignment
  const filterHeroes = async (searchQuery, alignment) => {
    try {
      let filteredHeroes = [];

      // If a search query is provided, search by name
      if (searchQuery) {
        const result = await axios.get(`http://nameless-temple-24409.herokuapp.com/api/superhero?name=${searchQuery}`);
        filteredHeroes = result.data;
        if (filteredHeroes.length === 0) {
          setError('No heroes found with the given name.');
          setHeroes([]);
          return;
        }
      } else {
        // Otherwise, fetch all heroes
        const result = await axios.get('http://nameless-temple-24409.herokuapp.com/api/heroes');
        filteredHeroes = result.data;
      }

      // Apply alignment filter if selected
      if (alignment) {
        filteredHeroes = filteredHeroes.filter(
          (hero) => hero.biography.alignment && hero.biography.alignment.toLowerCase() === alignment.toLowerCase()
        );
        console.log('Filtered Heroes by Alignment:', filteredHeroes); // Log the filtered heroes
      }

      // If no heroes found after filtering by both search and alignment
      if (filteredHeroes.length === 0) {
        setError('No heroes match your search criteria and alignment filter.');
        setHeroes([]);
        return;
      }

      // Update the heroes list based on the filtered results
      setHeroes(filteredHeroes);
      setError(''); // Clear any previous error messages
    } catch (err) {
      console.error('Error fetching or filtering heroes:', err.response?.data || err.message);
      setError('Unable to fetch heroes. Please try again later.');
    }
  };

  // Function to handle random hero selection
  const handleRandomize = () => {
    const randomHero = heroes[Math.floor(Math.random() * heroes.length)]; // Select a random hero
    if (randomHero) {
      navigate(`/details/${randomHero.id}`); // Navigate to the details page of the random hero
    }
  };

  return (
    <Layout> {/* Wrapping everything inside the Layout component */}
      <div className="characters-container">
        <div className="explanation-text">
          <p>
            Welcome to Supers! Use the search box below to find your favorite heroes by name, 
            or filter them by their alignment (good, bad, or neutral). Whether you’re searching for a specific hero or exploring different alignments, 
            this tool will help you find the information you're looking for!
          </p>
          <p><em>"With great power comes great responsibility."</em> – Uncle Ben</p>
        </div>

        <h1>Search by Name or Filter by Alignment</h1>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter Superhero Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search by Name</button>
          <button type="button" onClick={handleRandomize} className="randomize-button">
            Randomize
          </button> {/* New Randomize button */}
        </form>

        {error && <p className="error-message">{error}</p>}

        <label className="alignment-label">Filter by Alignment:</label>
        <div className="alignment-dropdown">
          <select id="alignment" value={alignment} onChange={handleAlignmentChange}>
            <option value="">All Alignments</option>
            <option value="good">Good</option>
            <option value="bad">Bad</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>

        {heroes.length > 0 && (
          <div className="hero-list">
            {heroes.map((hero) => (
              <div key={`${hero.id}-${hero.name}`} className="hero-card">
                <Link to={`/details/${hero.id}`} className="hero-link">
                  {hero.image && hero.image.url ? (
                    <img src={hero.image.url} alt={hero.name} onError={(e) => { e.target.src = fallbackImage; }} />
                  ) : (
                    <img src={fallbackImage} alt="Placeholder" />
                  )}
                  <div className="hero-info">
                    <h3>{hero.fullName || hero.name}</h3>
                    <p><strong>Publisher:</strong> {hero.biography.publisher || "Unknown"}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Characters;