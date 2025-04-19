// client/main.js
const socket = io('http://localhost:3000');

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

// 🚀 Init
loadKeys();
loadScores();


