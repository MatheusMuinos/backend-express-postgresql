import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not defined in the environment variables.");
  process.exit(1);
}

console.log("Connecting to PostgreSQL with connection string:", connectionString);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // necessário para o Neon
  }
});

const connect = async () => {
  try {
    await pool.connect();
    console.log("Connected to PostgreSQL");
  } catch (error) {
    console.error("Error connecting to PostgreSQL", error);
    process.exit(1);
  }
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

export default { connect, pool, initializeDatabase };