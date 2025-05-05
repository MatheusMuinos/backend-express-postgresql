import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let body = req.body;

  // Caso o body venha como string (Vercel às vezes envia assim)
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid JSON body' });
    }
  }

  const { username, email, password } = body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING username;
    `;
    const result = await pool.query(query, [username, email, password]);
    return res.status(200).json({ message: 'User registered successfully', username: result.rows[0].username });
  } catch (err) {
    console.error("Error inserting user:", err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}
