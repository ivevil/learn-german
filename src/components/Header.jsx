import React from 'react';
import './Header.css';

const Header = ({ username, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1>Learn German with ChatGPT</h1>
        </div>
        <div className="header-right">
          <span className="welcome-text">Welcome, {username}!</span>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 