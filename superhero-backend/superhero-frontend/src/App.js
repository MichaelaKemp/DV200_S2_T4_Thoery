import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Characters from './components/Characters';
import Feedback from './components/Feedback';
import About from './components/About';
import Details from './components/Details';
import Comparison from './components/Comparison';
import axios from 'axios';
import { initGA, logPageView } from './components/Analytics'; // Import Google Analytics functions

function App() {
  const [superheroes, setSuperheroes] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics once when the app mounts
    initGA();

    // Fetch data from the backend
    const fetchSuperheroes = async () => {
      const result = await axios.get('https://supers-hub-b2090f2bdf4f.herokuapp.com/api/superheroes');
      setSuperheroes(result.data.results);  // Assuming API returns 'results' array
    };
    // Uncomment this line if you want to fetch superheroes data
    // fetchSuperheroes();
  }, []);

  useEffect(() => {
    // Log page view when the route changes
    logPageView(location.pathname);
  }, [location]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/about" element={<About />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/details/:id" element={<Details />} />
      </Routes>
    </Router>
  );
}

export default App;