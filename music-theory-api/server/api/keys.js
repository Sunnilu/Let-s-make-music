// server/api/keys.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const keysPath = path.join(__dirname, '../../data/keys.json');
let cache = null; // 🔁 In-memory cache

// Load and cache keys from file
function loadKeys() {
  if (!cache) {
    console.log('🔄 Loading keys into memory cache');
    cache = JSON.parse(fs.readFileSync(keysPath));
  }
  return cache;
}

// GET /api/keys
router.get('/', (req, res) => {
  const keys = loadKeys();
  res.json({ keys });
});

// GET /api/keys/:key
router.get('/:key', (req, res) => {
  const keys = loadKeys();
  const key = req.params.key;
  const scale = keys[key];

  if (!scale) {
    return res.status(404).json({ error: 'Key not found' });
  }

  res.json({ key, scale });
});

module.exports = router;

