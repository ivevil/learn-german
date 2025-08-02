export default function handler(req, res) {
  // Enable CORS for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check credentials against environment variables
    // eslint-disable-next-line no-undef
    const validUsername = process.env.USERNAME;
    // eslint-disable-next-line no-undef
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
} 