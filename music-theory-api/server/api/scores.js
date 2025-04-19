// server/api/scores.js
const express = require('express');
const router = express.Router();

// In-memory store (can be replaced with DB later)
const scores = [];

// GET all scores
router.get('/', (req, res) => {
  res.json({ scores });
});

// POST a new score
router.post('/', (req, res) => {
  const { username, points } = req.body;
  if (!username || typeof points !== 'number') {
    return res.status(400).json({ error: 'Invalid score submission' });
  }
  const newScore = { username, points, date: new Date().toISOString() };
  scores.push(newScore);
  res.status(201).json({ message: 'Score submitted', score: newScore });
});

module.exports = router;
