import React from 'react';
import './About.css'; // Assuming you'll add custom styles for the About page

const About = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <h1 className="navbar-title">Superhero & Villain Hub</h1>
        <ul className="navbar-links">
          <li><a href="/">Home</a></li>
          <li><a href="#characters">Characters</a></li>
          <li><a href="#feedback">Feedback</a></li>
        </ul>
      </nav>

      {/* Main Content (below the navbar) */}
      <div className="about-container">
        <div className="main-content">
          <h1>About Superhero & Villain Central Hub</h1>
          <p>
            Welcome to the Superhero & Villain Central Hub! This website is your one-stop resource
            for learning about superheroes, their abilities, backstories, and much more. Whether
            you're a fan or simply want to understand what your superhero-loving partner is talking
            about, this site will guide you through the vast world of superheroes and villains.
          </p>

          <h2>Who Is This For?</h2>
          <p>
            Our hub is built for everyone—from die-hard superhero fans to those new to the world
            of comics and movies. Whether you're trying to keep up with conversations about
            superheroes or just curious about who’s who, we’ve got all the details you need!
          </p>

          <h2>What Will You Find Here?</h2>
          <ul>
            <li>Comprehensive profiles of heroes and villains.</li>
            <li>Fun facts and trivia about your favorite characters.</li>
            <li>Searchable and filterable lists of characters from multiple universes (e.g., Marvel, DC).</li>
          </ul>

          <h2>Acknowledgments</h2>
          <p>
            This hub is powered by data from the <a href="https://superheroapi.com">Superhero API</a>.
            We’re thankful for their amazing resource, which helps bring superheroes to life on our site!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;