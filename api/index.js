import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

import db from './database/configdb.js';
import userRoute from './routes/user.route.js';
import tokenRoute from './routes/token.route.js';


db.connect()
  .then(() => db.initializeDatabase()) // Inicializa o banco de dados e cria a tabela users
  .then(() => console.log("Database initialized"))
  .catch((err) => console.error("Error during database initialization", err));

const app = express();

app.use(express.json());
app.use("/", userRoute);
app.use("/", tokenRoute);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});