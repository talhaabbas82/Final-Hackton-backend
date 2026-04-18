const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API working on Vercel 🚀" });
});

app.post("/login", (req, res) => {
  res.json({ success: true, data: req.body });
});

// IMPORTANT: no app.listen()
module.exports = app;