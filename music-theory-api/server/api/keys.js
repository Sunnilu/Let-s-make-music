// server/api/keys.js
const express = require('express');
const router = express.Router();
const keysData = require('../../data/keys.json');

// GET all key signatures
router.get('/', (req, res) => {
  res.json({ keys: keysData });
});

// GET notes for a specific key
router.get('/:key', (req, res) => {
  const key = req.params.key;
  const scale = keysData[key];

  if (!scale) {
    return res.status(404).json({ error: 'Key not found' });
  }

  res.json({ key, scale });
});

module.exports = router;
