const express = require("express");
const app = express();
const port = process.env.port || 8080;

require("dotenv").config();
app.use(express.json());

const { Pool, Client } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

//Dame a todos los usuarios
app.get("/", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM users");
    res.send(data.rows);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

//Dame un usuario basado en su id
app.get("/:id", async (req, res) => {
  const userID = Number(req.params.id);

  try {
    const data = await pool.query("SELECT * FROM users WHERE id = $1", [
      userID,
    ]);
    res.send(data.rows);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

//Crea a un nuevo ususario
app.post("/", async (req, res) => {
  const { id, first_name, last_name, age, active } = req.body;

  try {
    const data = await pool.query(
      "INSERT INTO users (id, first_name, last_name, age, active) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, first_name, last_name, age, active]
    );
    res.send(data.rows);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

//Edita un ususario existente
app.put("/:id", async (req, res) => {
  const userID = Number(req.params.id);
  const { first_name, last_name, age, active } = req.body;

  try {
    const data = await pool.query(
      "UPDATE users SET first_name = $1, last_name = $2, age = $3, active = $4 WHERE id = $5 RETURNING *",
      [first_name, last_name, age, active, userID]
    );
    res.send(data.rows);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

//Borra a un usuario
app.delete("/:id", async (req, res) => {
  const userID = Number(req.params.id);

  try {
    await pool.query("DELETE FROM users WHERE id = $1", [userID]);
    res.send("User deleted");
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
