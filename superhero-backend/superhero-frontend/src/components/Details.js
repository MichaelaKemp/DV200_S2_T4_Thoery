import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import fallbackImage from '../assets/user_icon.png';
import './Details.css';

const Details = () => {
  const { id } = useParams();
  const [hero, setHero] = useState(null);
  const [heroList, setHeroList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const heroCache = useMemo(() => ({}), []); // Cache for fetched hero details

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await axios.get('/api/heroes');
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
      if (heroCache[id]) {
        setHero(heroCache[id]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/superhero/${id}`);
        heroCache[id] = response.data; // Cache the fetched hero details
        setHero(response.data);
        setLoading(false);
      } catch (err) {
        setError('Unable to fetch hero details. Please try again.');
        setLoading(false);
      }
    };
    fetchHeroDetails();
  }, [id, heroCache]);

  const heroIndex = useMemo(() => heroList.findIndex((h) => h.id === id), [heroList, id]);

  const handleNavigate = useCallback(
    (direction) => {
      if (direction === 'next' && heroIndex < heroList.length - 1) {
        const nextHeroId = heroList[heroIndex + 1].id;
        navigate(`/details/${nextHeroId}`);
      } else if (direction === 'prev' && heroIndex > 0) {
        const prevHeroId = heroList[heroIndex - 1].id;
        navigate(`/details/${prevHeroId}`);
      }
    },
    [heroIndex, heroList, navigate]
  );

  if (loading) return <h1>Loading hero details...</h1>;
  if (error) return <h1>{error}</h1>;
  if (!hero) return <h1>Hero not found.</h1>;

  return (
    <div className="details-page">
      <button className="back-button" onClick={() => navigate('/characters')}>
        &#8592; Back to Characters
      </button>

      <div className="details-container">
        <h1>{hero.name}</h1>
        <img
          src={hero.image && hero.image.url ? hero.image.url : fallbackImage}
          alt={hero.name}
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />
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

      <div className="navigation-buttons">
        <button
          className="prev-button"
          onClick={() => handleNavigate('prev')}
          style={{ visibility: heroIndex > 0 ? 'visible' : 'hidden' }}
        >
          &#8592; Previous
        </button>
        <button
          className="next-button"
          onClick={() => handleNavigate('next')}
          style={{ visibility: heroIndex < heroList.length - 1 ? 'visible' : 'hidden' }}
        >
          Next &#8594;
        </button>
      </div>
    </div>
  );
};

export default Details;