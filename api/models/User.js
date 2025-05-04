import db from '../database/configdb.js';

const createUser = async (username, email, password) => {
  const query = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, username, email;
  `;
  const values = [username, email, password];
  const result = await db.pool.query(query, values);
  return result.rows[0];
};

const findUserByUsernameOrEmail = async (username, email) => {
  const query = `
    SELECT id, username, email, password
    FROM users
    WHERE username = $1 OR email = $2;
  `;
  const values = [username, email];
  const result = await db.pool.query(query, values);
  return result.rows[0];
};

const findAllUsers = async () => {
  const query = `
    SELECT id, username, email FROM users;
  `;
  const result = await db.pool.query(query);
  return result.rows;
};

export default { createUser, findUserByUsernameOrEmail, findAllUsers };