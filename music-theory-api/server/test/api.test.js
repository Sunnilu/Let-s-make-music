// server/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const notesRouter = require('./api/notes');
const keysRouter = require('./api/keys');
const scoresRouter = require('./api/scores');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// API routes
app.use('/api/notes', notesRouter);
app.use('/api/keys', keysRouter);
app.use('/api/scores', scoresRouter);

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Music Theory API',
      version: '1.0.0',
      description: 'API for real-time music theory trainer'
    }
  },
  apis: ['./server/api/*.js']
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// WebSocket
io.on('connection', (socket) => {
  console.log('🎶 User connected');
  socket.on('note-played', (note) => {
    console.log('Note received:', note);
    io.emit('note-update', note);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🎵 Music Theory API server running at http://localhost:${PORT}`);
});
