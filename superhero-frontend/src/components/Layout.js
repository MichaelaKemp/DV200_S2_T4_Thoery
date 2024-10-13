import React from 'react';
import './Layout.css';
import { Link } from 'react-router-dom';
import logo from '../assets/supers_logo.png'; // Update this path based on your project structure

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <nav className="navbar">
        <div className="navbar-brand">
          {/* Logo link */}
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
          <h1 className="navbar-title">Supers</h1>
        </div>
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