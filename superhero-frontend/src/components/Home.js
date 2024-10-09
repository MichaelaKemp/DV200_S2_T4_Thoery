import React from 'react';
import './Home.css'; // Add this for CSS styling

const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <h1 className="navbar-title">Superhero & Villain Hub</h1>
        <ul className="navbar-links">
          <li><a href="/Characters">Characters</a></li>
          <li><a href="/About">About</a></li>
          <li><a href="/Feedback">Feedback</a></li>
        </ul>
      </nav>
      <div className="main-content">
        <h2 className="main-title">Welcome to the Superhero & Villain Hub!</h2>
        <p className="description">
          This hub is your go-to place to learn all about your favorite superheroes and villains. 
          Whether you're a comic fan or just trying to keep up with your superhero-loving partner, 
          we've got all the details about powers, abilities, and origins!
        </p>
      </div>
    </div>
  );
};

export default Home;