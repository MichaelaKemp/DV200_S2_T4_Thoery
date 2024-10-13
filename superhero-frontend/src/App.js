import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Characters from './components/Characters';
import Feedback from './components/Feedback';
import About from './components/About';
import Details from './components/Details';
import Comparison from './components/Comparison';
import axios from 'axios';

function App() {
  const [superheroes, setSuperheroes] = useState([]);

  useEffect(() => {
    // Fetch data from the backend once
    const fetchSuperheroes = async () => {
      const result = await axios.get('http://localhost:3001/api/superheroes');
      setSuperheroes(result.data.results);  // Assuming API returns 'results' array
    };
    //fetchSuperheroes();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/about" element={<About />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/details/:id" element={<Details />} /> {/* Add this line */}
      </Routes>
    </Router>
  );
}

export default App;