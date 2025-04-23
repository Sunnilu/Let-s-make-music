const express = require('express');
const router = express.Router();
const keysData = require('../../data/keys.json');  // ✅ double-check this path

router.get('/', (req, res) => {
  res.json({ keys: keysData });
});

router.get('/:key', (req, res) => {
  const key = req.params.key;
  const scale = keysData[key];

  if (!scale) {
    return res.status(404).json({ error: 'Key not found' });
  }

  res.json({ key, scale });
});

module.exports = router;
