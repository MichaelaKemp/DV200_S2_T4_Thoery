import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Heroes.css';

const Heroes = () => {
  const { category } = useParams(); // Get the selected category from the URL
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the heroes based on the category
    const fetchHeroes = async () => {
      try {
        const response = await axios.get(`https://localhost:3001/api/heroes?category=${category}`);
        setHeroes(response.data); // Assuming the backend returns filtered heroes based on category
        setLoading(false);
      } catch (error) {
        console.error('Error fetching heroes:', error);
        setLoading(false);
      }
    };

    fetchHeroes();
  }, [category]);

  if (loading) {
    return <div>Loading heroes...</div>;
  }

  return (
    <div className="heroes-container">
      <h1>{category === 'good' ? 'Good' : category === 'bad' ? 'Bad' : 'Neutral'} Heroes</h1>
      <div className="hero-list">
        {heroes.length > 0 ? (
          heroes.map((hero) => (
            <div key={hero.id} className="hero-card">
              <img src={hero.image.url} alt={hero.name} />
              <h3>{hero.name}</h3>
              <p><strong>Alias:</strong> {hero.biography['full-name']}</p>
            </div>
          ))
        ) : (
          <p>No heroes found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default Heroes;