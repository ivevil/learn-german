import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get credentials from environment variables
    const envUsername = import.meta.env.VITE_USERNAME;
    const envPassword = import.meta.env.VITE_PASSWORD;
    
    // Check if credentials match
    if (username.trim() === envUsername && password === envPassword) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);
      onLogin(username);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Learn German with ChatGPT</h1>
          <p>Please log in to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
        
        <div className="login-footer">
          <p>Enter your credentials to access the application</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 