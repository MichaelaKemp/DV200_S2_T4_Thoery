import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Characters from './components/Characters';
import Details from './components/Details';
import Feedback from './components/Feedback';
import About from './components/About';
import axios from 'axios';

function App() {
  const [superheroes, setSuperheroes] = useState([]);

  useEffect(() => {
    // Fetch data from the backend once
    const fetchSuperheroes = async () => {
      const result = await axios.get('http://localhost:3001/api/superheroes');
      setSuperheroes(result.data.results);  // Assuming API returns 'results' array
    };
    fetchSuperheroes();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/characters" element={<Characters superheroes={superheroes} />} />
        <Route path="/characters/:id" element={<Details superheroes={superheroes} />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;