const express = require("express");
const mysql = require("mysql2");
const app = express();

// parse JSON
app.use(express.json());

// routes example
app.get("/", (req, res) => {
  res.send("Hello from Vercel backend!");
});

// connect to DB (use env vars)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Test DB connection
db.connect((err) => {
  if (err) {
    console.error("DB connection error:", err);
  } else {
    console.log("DB connected!");
  }
});

// instead of app.listen()
module.exports = app;
