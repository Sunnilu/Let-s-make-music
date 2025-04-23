// server/test/api.test.js
const request = require('supertest');
const express = require('express');
const keysRouter = require('../api/keys');
const notesRouter = require('../api/notes');
const scoresRouter = require('../api/scores');

const app = express();
app.use(express.json());
app.use('/api/keys', keysRouter);
app.use('/api/notes', notesRouter);
app.use('/api/scores', scoresRouter);

describe('🎼 Music Theory API', () => {
  it('GET /api/notes should return note list', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.statusCode).toBe(200);
    expect(res.body.notes).toContain('C');
  });

  it('GET /api/keys should return all keys', async () => {
    const res = await request(app).get('/api/keys');
    expect(res.statusCode).toBe(200);
    expect(res.body.keys).toHaveProperty('C');
  });

  it('GET /api/keys/:key should return correct key scale', async () => {
    const res = await request(app).get('/api/keys/C');
    expect(res.statusCode).toBe(200);
    expect(res.body.scale).toEqual(
      expect.arrayContaining(['C', 'D', 'E', 'F', 'G', 'A', 'B'])
    );
  });

  it('POST /api/scores should add a score', async () => {
    const res = await request(app).post('/api/scores').send({
      username: 'TestUser',
      points: 88
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.score).toMatchObject({ username: 'TestUser', points: 88 });
  });

  it('GET /api/scores should return list of scores', async () => {
    const res = await request(app).get('/api/scores');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.scores)).toBe(true);
  });
});
