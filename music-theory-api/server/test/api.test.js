// server/test/api.test.js
const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/notes', require('../api/notes'));
app.use('/api/keys', require('../api/keys'));
app.use('/api/scores', require('../api/scores'));

describe('Music Theory API', () => {
  test('GET /api/notes returns list of notes', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.statusCode).toBe(200);
    expect(res.body.notes).toContain('C');
  });

  test('GET /api/keys returns all key signatures', async () => {
    const res = await request(app).get('/api/keys');
    expect(res.statusCode).toBe(200);
    expect(res.body.keys).toHaveProperty('C');
    expect(Array.isArray(res.body.keys.C)).toBe(true);
  });

  test('GET /api/keys/:key returns notes in key', async () => {
    const res = await request(app).get('/api/keys/C');
    expect(res.statusCode).toBe(200);
    expect(res.body.key).toBe('C');
    expect(res.body.scale).toEqual(expect.arrayContaining(['C', 'D', 'E']));
  });

  test('POST /api/scores adds a new score', async () => {
    const res = await request(app)
      .post('/api/scores')
      .send({ username: 'TestUser', points: 50 });
    expect(res.statusCode).toBe(201);
    expect(res.body.score.username).toBe('TestUser');
  });

  test('GET /api/scores returns score list', async () => {
    const res = await request(app).get('/api/scores');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.scores)).toBe(true);
  });
});
