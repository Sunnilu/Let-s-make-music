// server/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Music Theory API',
      version: '1.0.0',
      description: 'API for real-time music theory training'
    }
  },
  apis: ['./server/api/*.js']
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Sample API routes
const notesApi = require('./api/notes');
const keysApi = require('./api/keys');
const scoresApi = require('./api/scores');

app.use('/api/notes', notesApi);
app.use('/api/keys', keysApi);
app.use('/api/scores', scoresApi);

// WebSocket connection
io.on('connection', (socket) => {
  console.log('🎶 User connected');

  socket.on('note-played', (note) => {
    console.log('Note received:', note);
    io.emit('note-update', note);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎵 Music Theory API server running at http://localhost:${PORT}`);
});

