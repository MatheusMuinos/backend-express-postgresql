import express from "express";
import db from "./models/index.js";
import userRoute from "./routes/user.route.js";

db.sequelize.sync({ alter: true }) // Ajusta a estrutura das tabelas sem deletar dados
    .then(() => {
        console.log("Database synchronized");
    })
    .catch((error) => {
        console.error("Error synchronizing database:", error);
    });

const app = express();

app.use(express.json());

app.use("/", userRoute);
app.use("/SecuredRoute", userRoute);
app.use("/users", userRoute);

app.get("/", (req, res) => {
    res.send("Banco de Dados está no ar!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

