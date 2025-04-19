const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// Sample API route
app.get('/api/keys/:key', (req, res) => {
  const key = req.params.key;
  // later: load from keys.json
  res.json({ key, scale: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] });
});

// Socket.IO real-time connection
io.on('connection', (socket) => {
  console.log('🎵 A user connected');

  socket.on('note-played', (note) => {
    console.log(`🎶 Note: ${note}`);
    io.emit('note-display', note);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected');
  });
});

server.listen(3000, () => {
  console.log('🚀 Listening on http://localhost:3000');
});
