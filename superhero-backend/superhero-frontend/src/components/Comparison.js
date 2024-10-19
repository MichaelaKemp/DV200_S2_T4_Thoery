import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import Layout from './Layout';
import './Comparison.css';

const Comparison = () => {
  const [heroes, setHeroes] = useState([]); // Store all heroes
  const [hero1, setHero1] = useState(null); // Selected hero 1
  const [hero2, setHero2] = useState(null); // Selected hero 2
  const [selectedHero1, setSelectedHero1] = useState(''); // Hero 1's ID
  const [selectedHero2, setSelectedHero2] = useState(''); // Hero 2's ID
  const [error, setError] = useState('');
  const heroCache = useMemo(() => ({}), []); // Cache for fetched hero details

  // Fetch all heroes on component mount
  useEffect(() => {
    const fetchAllHeroes = async () => {
      try {
        const result = await axios.get('/api/heroes');
        setHeroes(result.data);
      } catch (err) {
        setError('Error fetching heroes, please try again later.');
      }
    };
    fetchAllHeroes();
  }, []);

  // Function to fetch hero details with caching
  const fetchHeroDetails = useCallback(async (heroId, setHero) => {
    if (heroCache[heroId]) {
      setHero(heroCache[heroId]);
      return;
    }

    try {
      const result = await axios.get(`/api/superhero/${heroId}`);
      heroCache[heroId] = result.data; // Cache the hero details
      setHero(result.data);
    } catch (err) {
      setError('Error fetching hero details, please try again later.');
    }
  }, [heroCache]);

  // Handle hero selection and fetch details
  const handleHeroSelect = useCallback((heroId, setSelectedHero, setHero) => {
    setSelectedHero(heroId);
    if (heroId) {
      fetchHeroDetails(heroId, setHero);
    } else {
      setHero(null); // Reset hero details if no hero is selected
    }
  }, [fetchHeroDetails]);

  // Handle null values and convert stats to integers
  const getStatValue = (stat) => (stat === null || stat === 'null' ? 0 : parseInt(stat, 10));

  // Compare stats and return the appropriate color
  const compareStats = useCallback((stat1, stat2) => {
    const stat1Val = getStatValue(stat1);
    const stat2Val = getStatValue(stat2);
    return stat1Val > stat2Val ? 'green' : stat1Val < stat2Val ? 'red' : 'orange';
  }, []);

  const renderStat = useCallback((stat, statName, comparisonStat) => (
    <li style={{ color: compareStats(stat, comparisonStat) }}>
      {statName}: {stat !== null && stat !== 'null' ? stat : 'N/A'}
    </li>
  ), [compareStats]);

  // Memoize the total stats calculation for performance
  const calculateTotalStats = useCallback((hero) => {
    return ['intelligence', 'strength', 'speed', 'durability', 'power', 'combat'].reduce(
      (total, stat) => total + getStatValue(hero.powerstats?.[stat]),
      0
    );
  }, []);

  const hero1TotalStats = useMemo(() => (hero1 ? calculateTotalStats(hero1) : 0), [hero1, calculateTotalStats]);
  const hero2TotalStats = useMemo(() => (hero2 ? calculateTotalStats(hero2) : 0), [hero2, calculateTotalStats]);

  return (
    <Layout>
      <div className="comparison-container">
        <h1>Super Comparison</h1>

        <div className="hero-selection">
          <div className="select-hero">
            <label htmlFor="hero1">Select Super 1:</label>
            <select id="hero1" value={selectedHero1} onChange={(e) => handleHeroSelect(e.target.value, setSelectedHero1, setHero1)}>
              <option value="">Select a Super</option>
              {heroes.map((hero) => (
                <option key={hero.id} value={hero.id}>{hero.name}</option>
              ))}
            </select>
          </div>

          <div className="select-hero">
            <label htmlFor="hero2">Select Super 2:</label>
            <select id="hero2" value={selectedHero2} onChange={(e) => handleHeroSelect(e.target.value, setSelectedHero2, setHero2)}>
              <option value="">Select a Super</option>
              {heroes.map((hero) => (
                <option key={hero.id} value={hero.id}>{hero.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="comparison-results">
          {[hero1, hero2].map((hero, index) => (
            <div key={index} className="details-container comparison-hero-card">
              {hero ? (
                <>
                  <h1>{hero.name}</h1>
                  {hero.image && <img src={hero.image.url} alt={hero.name} />}
                  <ul className="comparison-power-stats">
                    {['intelligence', 'strength', 'speed', 'durability', 'power', 'combat'].map((statName) =>
                      renderStat(hero.powerstats?.[statName], statName.charAt(0).toUpperCase() + statName.slice(1), index === 0 ? hero2?.powerstats?.[statName] : hero1?.powerstats?.[statName])
                    )}
                  </ul>
                </>
              ) : (
                <div className="empty-card">Select a Hero</div>
              )}
            </div>
          ))}
        </div>

        {hero1 && hero2 && (
          <div className="winning-possibility">
            <h2>
              {hero1TotalStats > hero2TotalStats
                ? `${hero1.name} has a higher chance of winning!`
                : `${hero2.name} has a higher chance of winning!`}
            </h2>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Comparison;