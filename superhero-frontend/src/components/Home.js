import React from 'react';
import Layout from './Layout'; // Import the Layout component
import './Home.css'; // Add this for CSS styling

const Home = () => {
  return (
    <Layout> {/* Wrap the content in Layout */}
      <div className="main-content">
        <h2 className="main-title">Welcome to the Superhero & Villain Hub!</h2>
        <p className="description">
          This hub is your go-to place to learn all about your favorite superheroes and villains. 
          Whether you're a comic fan or just trying to keep up with your superhero-loving partner, 
          we've got all the details about powers, abilities, and origins!
        </p>
      </div>
    </Layout>
  );
};

export default Home;