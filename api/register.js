// api/register.js
import db from '../database/configdb.js';
import User from '../models/User.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  let body = req.body;

  // Vercel pode passar req.body como string
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid JSON body' });
    }
  }

  const { username, email, password } = body;

  try {
    const user = await User.createUser(username, email, password);
    return res.status(200).json({ message: 'User registered successfully', username: user.username });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
