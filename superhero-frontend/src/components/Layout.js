// Layout.js
import React from 'react';
import './Layout.css';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <nav className="navbar">
        <h1 className="navbar-title">Superhero & Villain Hub</h1>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/About">About</Link></li>
          <li><Link to="/Characters">Characters</Link></li>
          <li><Link to="/Comparison">Comparison</Link></li>
          <li><Link to="/Feedback">Feedback</Link></li>
        </ul>
      </nav>
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;