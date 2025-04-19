// server/api/notes.js
const express = require('express');
const router = express.Router();

// Example GET endpoint to fetch a list of notes
router.get('/', (req, res) => {
  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  res.json({ notes });
});

// Example POST endpoint to validate a played note
router.post('/validate', (req, res) => {
  const { note } = req.body;
  const validNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const isValid = validNotes.includes(note);
  res.json({ note, isValid });
});

module.exports = router;
