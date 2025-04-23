// server/api/scores.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const scoresFile = path.join(__dirname, '../../data/scores.json');

// Simulated test user middleware
router.use((req, res, next) => {
  req.user = { username: 'TestUser' }; // 👤 Test user always attached
  next();
});

// Load scores
function getScores() {
  if (!fs.existsSync(scoresFile)) return [];
  return JSON.parse(fs.readFileSync(scoresFile));
}

// Save scores
function saveScores(scores) {
  fs.writeFileSync(scoresFile, JSON.stringify(scores, null, 2));
}

// GET /api/scores?page=&limit=
router.get('/', (req, res) => {
  const allScores = getScores().sort((a, b) => b.points - a.points);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  const pagedScores = allScores.slice(start, end);

  res.json({
    page,
    limit,
    total: allScores.length,
    scores: pagedScores
  });
});

// POST /api/scores
router.post('/', (req, res) => {
  const { points } = req.body;
  const username = req.user?.username || 'Anonymous';

  if (typeof points !== 'number') {
    return res.status(400).json({ error: 'Numeric points required.' });
  }

  const scores = getScores();
  const newScore = { username, points, date: new Date().toISOString() };
  scores.push(newScore);
  saveScores(scores);
  res.status(201).json({ score: newScore });
});

module.exports = router;