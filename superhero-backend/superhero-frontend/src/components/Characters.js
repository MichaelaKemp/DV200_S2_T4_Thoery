import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import fallbackImage from '../assets/user_icon.png';
import Layout from './Layout';
import './Characters.css';

const Characters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [heroes, setHeroes] = useState([]);
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [error, setError] = useState('');
  const [alignment, setAlignment] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  // Fetch all heroes only once when the component mounts
  useEffect(() => {
    fetchAllHeroes();
  }, []);

  const fetchAllHeroes = async () => {
    try {
      setLoading(true); // Set loading state
      setError(''); // Clear any previous errors
      const result = await axios.get('/api/heroes');
      console.log('API response:', result);

      if (Array.isArray(result.data)) {
        const sortedHeroes = result.data.sort((a, b) => a.name.localeCompare(b.name));
        console.log('Total Heroes Fetched:', sortedHeroes.length);
        setHeroes(sortedHeroes);
        setFilteredHeroes(sortedHeroes); // Initialize filtered heroes
      } else {
        console.error('Unexpected data format:', result.data);
        setError('Unexpected data format from API.');
      }
    } catch (err) {
      console.error('Error fetching heroes:', err.response?.data || err.message);
      setError('Unable to fetch heroes. Please try again later.');
    } finally {
      setLoading(false); // Clear loading state
    }
  };

  // Filtering logic moved inside useEffect
  useEffect(() => {
    if (!loading) {
      filterHeroes(searchQuery, alignment);
    }
  }, [searchQuery, alignment, heroes, loading]); // Run this effect whenever these dependencies change

  // Filter heroes based on search query and alignment
  const filterHeroes = (searchQuery, alignment) => {
    setError(''); // Clear any previous error message
    let filtered = [...heroes];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(hero => 
        hero.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by alignment
    if (alignment) {
      filtered = filtered.filter(hero => 
        hero.biography.alignment && 
        hero.biography.alignment.toLowerCase() === alignment.toLowerCase()
      );
    }

    // Update the filtered heroes state
    setFilteredHeroes(filtered);

    // Show error if no heroes match and not in loading state
    if (filtered.length === 0 && !loading) {
      setError('No heroes match your search criteria and alignment filter.');
    }
  };

  // Handle random hero selection
  const handleRandomize = () => {
    const randomHero = filteredHeroes[Math.floor(Math.random() * filteredHeroes.length)];
    if (randomHero) {
      navigate(`/details/${randomHero.id}`);
    }
  };

  return (
    <Layout>
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

        <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Enter Superhero Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="button" onClick={handleRandomize} className="randomize-button">
            Randomize
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="alignment-dropdown">
          <select id="alignment" value={alignment} onChange={(e) => setAlignment(e.target.value)}>
            <option value="">All Alignments</option>
            <option value="good">Good</option>
            <option value="bad">Bad</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>

        {loading ? (
          <label className="alignment-label">Loading heroes...</label>
        ) : (
          filteredHeroes.length > 0 && (
            <div className="hero-list">
              {filteredHeroes.map((hero) => (
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
          )
        )}
      </div>
    </Layout>
  );
};

export default Characters;