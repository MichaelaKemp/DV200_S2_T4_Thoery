import React, { useState, useEffect } from 'react';
import './Characters.css';

const Characters = () => {
  const [searchQuery, setSearchQuery] = useState(''); // Search input state
  const [category, setCategory] = useState('all'); // Category filter state
  const [characters, setCharacters] = useState([]); // Fetched characters
  const [error, setError] = useState(null); // Error handling

  // Function to fetch character data from the backend
  const fetchCharacters = async (characterName) => {
    try {
      console.log('Fetching characters with name:', characterName); // Log the search query
      const response = await fetch(`http://localhost:3001/api/superheroes?name=${characterName}`);
      
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.message) {
        setError(data.message); // Handle custom error messages from the backend
        setCharacters([]);
      } else {
        setCharacters(data.results);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching superhero data:', error);
      setError('Error fetching data from the server.');
    }
  };  

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Ensure a search query exists before making the API call
    if (searchQuery.trim()) {
      fetchCharacters(searchQuery);
    } else {
      setError('Please enter a character name to search.');
    }
  };

  // Filter characters by category (heroes/villains/neutral)
  const filterCharactersByCategory = () => {
    return characters.filter((character) => {
      if (category === 'all') return true; // Show all characters
      if (category === 'hero') return character.biography.alignment === 'good';
      if (category === 'villain') return character.biography.alignment === 'bad';
      if (category === 'neutral') return character.biography.alignment === 'neutral';
      return false;
    });
  };

  return (
    <div className="characters-container">
      {/* Search Bar */}
      <form className="search-bar" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search for a superhero or villain..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Filter Section */}
      <div className="filter-section">
        <label>Filter by Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="hero">Heroes</option>
          <option value="villain">Villains</option>
          <option value="neutral">Neutral</option>
        </select>
      </div>

      {/* Display Characters */}
      <div className="character-list">
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          filterCharactersByCategory().map((character) => (
            <div key={character.id} className="character-card">
              <img src={character.image.url} alt={character.name} />
              <h3>{character.name}</h3>
              <p>Real Name: {character.biography['full-name']}</p>
              <p>Alignment: {character.biography.alignment}</p>
              <p>Power: {character.powerstats.strength}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Characters;