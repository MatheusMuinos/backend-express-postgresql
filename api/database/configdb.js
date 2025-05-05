import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not defined in the environment variables.");
  process.exit(1);
}

console.log("Connecting to PostgreSQL with connection string:", connectionString);

// Detecta se é banco em nuvem (ex: Neon) pelo domínio ou query params
const isCloudDatabase = connectionString.includes('.neon.tech') || connectionString.includes('sslmode=require');

const pool = new Pool({
  connectionString,
  ...(isCloudDatabase && {
    ssl: { rejectUnauthorized: false }
  })
});

const connect = async () => {
  console.log("PostgreSQL pool is ready (no manual connection needed).");
};

const initializeDatabase = async () => {
  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    );
  `;

  try {
    await pool.query(createUsersTableQuery);
    console.log("Users table initialized");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

export default { connect, initializeDatabase, pool };
