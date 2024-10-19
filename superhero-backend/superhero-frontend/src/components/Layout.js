import React, { useState } from 'react';
import './Layout.css';
import { Link } from 'react-router-dom';
import logo from '../assets/supers_logo.png';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="layout-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
          <h1 className="navbar-title">Supers</h1>
        </div>
        <button className="burger-menu" onClick={toggleMenu}>
          ☰
        </button>
        <ul className={`navbar-links ${isMenuOpen ? 'navbar-active' : ''}`}>
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/About" onClick={toggleMenu}>About</Link></li>
          <li><Link to="/Characters" onClick={toggleMenu}>Characters</Link></li>
          <li><Link to="/Comparison" onClick={toggleMenu}>Comparison</Link></li>
          <li><Link to="/Feedback" onClick={toggleMenu}>Feedback</Link></li>
        </ul>
      </nav>
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;