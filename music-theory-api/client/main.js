// client/main.js
const socket = io('http://localhost:3000');

let allKeys = {}; // for quiz access

// 🎵 Real-time note updates
socket.on('note-update', (note) => {
  const li = document.createElement('li');
  li.textContent = `🎶 Note received: ${note}`;
  document.getElementById('notesList').appendChild(li);
});

// 📤 Send note to server
function sendNote() {
  const note = document.getElementById('noteInput').value.trim();
  if (note) {
    socket.emit('note-played', note);
    document.getElementById('noteInput').value = '';
  }
}

// 🔑 Fetch key signature data and populate dropdown
async function loadKeys() {
  const res = await fetch('http://localhost:3000/api/keys');
  const data = await res.json();
  allKeys = data.keys;

  const select = document.getElementById('keySelect');
  Object.keys(data.keys).forEach(key => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = key;
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    const selectedKey = select.value;
    displayScale(selectedKey);
  });

  generateQuizKey(); // init quiz on load
}

// 🧠 Display notes of selected key
async function displayScale(key) {
  const res = await fetch(`http://localhost:3000/api/keys/${key}`);
  const data = await res.json();
  const ul = document.getElementById('keyNotes');
  ul.innerHTML = '';
  data.scale.forEach(note => {
    const li = document.createElement('li');
    li.textContent = note;
    ul.appendChild(li);
  });
}

// 🏆 Load scores from API
async function loadScores() {
  const res = await fetch('http://localhost:3000/api/scores');
  const data = await res.json();
  const ul = document.getElementById('scoreList');
  ul.innerHTML = '';
  data.scores.forEach(score => {
    const li = document.createElement('li');
    li.textContent = `${score.username} — ${score.points} pts (${new Date(score.date).toLocaleString()})`;
    ul.appendChild(li);
  });
}

// 📝 Submit score to server
async function submitScore(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const points = parseInt(document.getElementById('points').value);

  if (!username || isNaN(points)) return;

  const res = await fetch('http://localhost:3000/api/scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, points })
  });

  const result = await res.json();
  console.log('Submitted:', result);
  loadScores();
  document.getElementById('scoreForm').reset();
}

// 🎯 Key Signature Quiz Logic
let currentQuizKey = '';

function generateQuizKey() {
  const keys = Object.keys(allKeys);
  currentQuizKey = keys[Math.floor(Math.random() * keys.length)];
  document.getElementById('quizKey').textContent = currentQuizKey;
}

function submitQuizAnswer() {
  const userInput = document.getElementById('userAnswer').value.trim();
  if (!userInput) return;

  const userNotes = userInput.split(',').map(n => n.trim().toUpperCase());
  const correctNotes = allKeys[currentQuizKey].map(n => n.toUpperCase());

  const isCorrect = userNotes.length === correctNotes.length &&
    userNotes.every((n, i) => n === correctNotes[i]);

  const feedback = document.getElementById('quizFeedback');
  if (isCorrect) {
    feedback.textContent = `✅ Correct! The ${currentQuizKey} scale is: ${correctNotes.join(', ')}`;
  } else {
    feedback.textContent = `❌ Try again! The correct notes for ${currentQuizKey} are: ${correctNotes.join(', ')}`;
  }

  generateQuizKey(); // load next question
  document.getElementById('userAnswer').value = '';
}

// 🚀 Init
loadKeys();
loadScores();

