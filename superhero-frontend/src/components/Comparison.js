import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './Layout'; // Importing the Layout component for consistency
import './Comparison.css'; // Add a new CSS file for comparison-specific styling

const Comparison = () => {
  const [heroes, setHeroes] = useState([]); // Store all heroes
  const [hero1, setHero1] = useState(null); // Selected hero 1
  const [hero2, setHero2] = useState(null); // Selected hero 2
  const [selectedHero1, setSelectedHero1] = useState(''); // Hero 1's ID
  const [selectedHero2, setSelectedHero2] = useState(''); // Hero 2's ID
  const [error, setError] = useState('');

  // Fetch all heroes on component mount
  useEffect(() => {
    const fetchAllHeroes = async () => {
      try {
        const result = await axios.get('http://nameless-temple-24409.herokuapp.com/api/heroes'); // Replace with actual API
        console.log('All Heroes Fetched:', result.data); // Log all fetched heroes
        setHeroes(result.data);
      } catch (err) {
        setError('Error fetching heroes, please try again later.');
      }
    };
    fetchAllHeroes();
  }, []);

  // Fetch hero details for both heroes
  const fetchHeroDetails = async (heroId, setHero) => {
    try {
      const result = await axios.get(`http://nameless-temple-24409.herokuapp.com/api/superhero/${heroId}`);
      console.log(`Hero Details Fetched for ID ${heroId}:`, result.data); // Log hero details
      setHero(result.data);
    } catch (err) {
      setError('Error fetching hero details, please try again later.');
    }
  };

  const handleHero1Select = (e) => {
    setSelectedHero1(e.target.value);
    fetchHeroDetails(e.target.value, setHero1);
  };

  const handleHero2Select = (e) => {
    setSelectedHero2(e.target.value);
    fetchHeroDetails(e.target.value, setHero2);
  };

  // Handle null values and convert stats to integers
  const getStatValue = (stat) => {
    if (stat === null || stat === 'null') {
      return 0; // Treat null values as 0
    }
    return parseInt(stat, 10); // Ensure stat is treated as an integer
  };

  // Compare stats and return the appropriate color
  const compareStats = (stat1, stat2) => {
    const stat1Val = getStatValue(stat1);
    const stat2Val = getStatValue(stat2);

    if (stat1Val > stat2Val) return 'green';
    if (stat1Val < stat2Val) return 'red';
    return 'orange'; // Both stats are equal
  };

  const renderStat = (stat, statName, comparisonStat) => {
    return (
      <li style={{ color: compareStats(stat, comparisonStat) }}>
        {statName}: {stat !== null && stat !== 'null' ? stat : 'N/A'}
      </li>
    );
  };

  return (
    <Layout> {/* Wrapping everything in Layout */}
      <div className="comparison-container">
        <h1>Super Comparison</h1>

        <div className="hero-selection">
          {/* Dropdowns for selecting heroes */}
          <div className="select-hero">
            <label htmlFor="hero1">Select Super 1:</label>
            <select id="hero1" value={selectedHero1} onChange={handleHero1Select}>
              <option value="">Select a Super</option>
              {heroes.map((hero) => (
                <option key={hero.id} value={hero.id}>{hero.name}</option>
              ))}
            </select>
          </div>

          <div className="select-hero">
            <label htmlFor="hero2">Select Super 2:</label>
            <select id="hero2" value={selectedHero2} onChange={handleHero2Select}>
              <option value="">Select a Super</option>
              {heroes.map((hero) => (
                <option key={hero.id} value={hero.id}>{hero.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Display both heroes once they are selected */}
        <div className="comparison-results">
          <div className="details-container comparison-hero-card">
            {hero1 ? (
              <>
                <h1>{hero1.name}</h1>
                {hero1.image && <img src={hero1.image.url} alt={hero1.name} />}
                <ul className="comparison-power-stats">
                  {renderStat(hero1.powerstats.intelligence, 'Intelligence', hero2?.powerstats?.intelligence)}
                  {renderStat(hero1.powerstats.strength, 'Strength', hero2?.powerstats?.strength)}
                  {renderStat(hero1.powerstats.speed, 'Speed', hero2?.powerstats?.speed)}
                  {renderStat(hero1.powerstats.durability, 'Durability', hero2?.powerstats?.durability)}
                  {renderStat(hero1.powerstats.power, 'Power', hero2?.powerstats?.power)}
                  {renderStat(hero1.powerstats.combat, 'Combat', hero2?.powerstats?.combat)}
                </ul>
              </>
            ) : (
              <div className="empty-card">Select a Hero</div> // Placeholder text for empty card
            )}
          </div>

          <div className="details-container comparison-hero-card">
            {hero2 ? (
              <>
                <h1>{hero2.name}</h1>
                {hero2.image && <img src={hero2.image.url} alt={hero2.name} />}
                <ul className="comparison-power-stats">
                  {renderStat(hero2.powerstats.intelligence, 'Intelligence', hero1?.powerstats?.intelligence)}
                  {renderStat(hero2.powerstats.strength, 'Strength', hero1?.powerstats?.strength)}
                  {renderStat(hero2.powerstats.speed, 'Speed', hero1?.powerstats?.speed)}
                  {renderStat(hero2.powerstats.durability, 'Durability', hero1?.powerstats?.durability)}
                  {renderStat(hero2.powerstats.power, 'Power', hero1?.powerstats?.power)}
                  {renderStat(hero2.powerstats.combat, 'Combat', hero1?.powerstats?.combat)}
                </ul>
              </>
            ) : (
              <div className="empty-card">Select a Hero</div> // Placeholder text for empty card
            )}
          </div>
        </div>

        {/* Calculate and display the winner based on total stats */}
        {hero1 && hero2 && (() => {
          const hero1TotalStats = 
            getStatValue(hero1.powerstats.intelligence) + 
            getStatValue(hero1.powerstats.strength) + 
            getStatValue(hero1.powerstats.speed) + 
            getStatValue(hero1.powerstats.durability) + 
            getStatValue(hero1.powerstats.power) + 
            getStatValue(hero1.powerstats.combat);

          const hero2TotalStats = 
            getStatValue(hero2.powerstats.intelligence) + 
            getStatValue(hero2.powerstats.strength) + 
            getStatValue(hero2.powerstats.speed) + 
            getStatValue(hero2.powerstats.durability) + 
            getStatValue(hero2.powerstats.power) + 
            getStatValue(hero2.powerstats.combat);

          // Log totals to check their values
          console.log('Hero 1 Total Stats:', hero1TotalStats, hero1);
          console.log('Hero 2 Total Stats:', hero2TotalStats, hero2);

          return (
            <div className="winning-possibility">
              <h2>
                {hero1TotalStats > hero2TotalStats
                  ? `${hero1.name} has a higher chance of winning!`
                  : `${hero2.name} has a higher chance of winning!`}
              </h2>
            </div>
          );
        })()}
      </div>
    </Layout>
  );
};

export default Comparison;