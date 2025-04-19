// client/main.js
const socket = io('http://localhost:3000');

// Listen for note updates
socket.on('note-update', (note) => {
  const li = document.createElement('li');
  li.textContent = `🎶 Note received: ${note}`;
  document.getElementById('notesList').appendChild(li);
});

// Emit a note
function sendNote() {
  const note = document.getElementById('noteInput').value.trim();
  if (note) {
    socket.emit('note-played', note);
    document.getElementById('noteInput').value = '';
  }
}
