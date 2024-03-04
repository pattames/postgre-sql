const express = require("express");
const app = express();
const port = process.env.port || 8080;

require("dotenv").config();

const { Pool, Client } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

app.get("/", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM users");
    res.send(data.rows);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

app.get("/:id", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM users");
    res.send(data.rows);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

// app.get("/time", async (req, res) => {
//   try {
//     const data = await pool.query("SELECT NOW()");
//     res.send(data);
//   } catch (err) {
//     console.log(err.message);
//     res.sendStatus(500);
//   }
// });

app.listen(port, () => console.log(`Listening on port ${port}`));
