/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory (after build)
app.use(express.static(join(__dirname, 'dist')));

// Authentication endpoint
app.post('/api/auth', (req, res) => {
  // Enable CORS for development
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check credentials against environment variables
    const validUsername = process.env.USERNAME;
    const validPassword = process.env.PASSWORD;

    if (!validUsername || !validPassword) {
      console.error('Environment variables not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Compare credentials
    if (username === validUsername && password === validPassword) {
      // Success - return user info (without sensitive data)
      res.status(200).json({ 
        success: true, 
        user: { username: validUsername }
      });
    } else {
      // Invalid credentials
      res.status(401).json({ error: 'Invalid credentials' });
    }

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 