import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Details.css';

const Details = () => {
  const { id } = useParams();
  const [hero, setHero] = useState(null);
  const [heroList, setHeroList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/heroes');
        const sortedHeroes = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setHeroList(sortedHeroes);
      } catch (err) {
        setError('Unable to fetch heroes. Please try again.');
      }
    };
    fetchHeroes();
  }, []);

  useEffect(() => {
    const fetchHeroDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/api/superhero/${id}`);
        setHero(response.data);
        setLoading(false);
      } catch (err) {
        setError('Unable to fetch hero details. Please try again.');
        setLoading(false);
      }
    };
    fetchHeroDetails();
  }, [id]);

  const heroIndex = heroList.findIndex((h) => h.id === id);

  const handleNext = () => {
    if (heroIndex !== -1 && heroIndex < heroList.length - 1) {
      const nextHeroId = heroList[heroIndex + 1].id;
      navigate(`/details/${nextHeroId}`);
    }
  };

  const handlePrevious = () => {
    if (heroIndex > 0) {
      const prevHeroId = heroList[heroIndex - 1].id;
      navigate(`/details/${prevHeroId}`);
    }
  };

  if (loading) return <p>Loading hero details...</p>;
  if (error) return <p>{error}</p>;
  if (!hero) return <p>Hero not found.</p>;

  return (
    <div className="details-page">
      {/* Back Button outside the card (top left) */}
      <button className="back-button" onClick={() => navigate('/characters')}>
        &#8592; Back to Characters
      </button>

      <div className="details-container">
        <h1>{hero.name}</h1>
        {hero.image && <img src={hero.image.url} alt={hero.name} />}
        <p><strong>Full Name:</strong> {hero.biography['full-name'] || 'Unknown'}</p>
        <p><strong>Place of Birth:</strong> {hero.biography['place-of-birth'] || 'Unknown'}</p>
        <p><strong>Publisher:</strong> {hero.biography.publisher || 'Unknown'}</p>
        <p><strong>First Appearance:</strong> {hero.biography['first-appearance'] || 'Unknown'}</p>
        <p><strong>Alignment:</strong> {hero.biography.alignment || 'Unknown'}</p>
        <p><strong>Occupation:</strong> {hero.work.occupation || 'Unknown'}</p>
        <p><strong>Base:</strong> {hero.work.base || 'Unknown'}</p>
        <p><strong>Power Stats:</strong></p>
        <ul className="power-stats">
          <li>Intelligence: {hero.powerstats.intelligence}</li>
          <li>Strength: {hero.powerstats.strength}</li>
          <li>Speed: {hero.powerstats.speed}</li>
          <li>Durability: {hero.powerstats.durability}</li>
          <li>Power: {hero.powerstats.power}</li>
          <li>Combat: {hero.powerstats.combat}</li>
        </ul>
      </div>

      {/* Previous and Next Buttons outside the card */}
      <div className="navigation-buttons">
        {heroIndex > 0 && (
          <button className="prev-button" onClick={handlePrevious}>
            &#8592; Previous
          </button>
        )}
        {heroIndex < heroList.length - 1 && (
          <button className="next-button" onClick={handleNext}>
            Next &#8594;
          </button>
        )}
      </div>
    </div>
  );
};

export default Details;