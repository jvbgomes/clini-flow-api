const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

describe('Auth endpoints', () => {
  afterAll(async () => {
    await sequelize.close();
  });

  test('POST /auth/register with valid data should return 201', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ name: 'Test User', email: 'testuser@test.com', password: '123456' });

    expect(response.status).toBe(201);
    expect(response.body).not.toHaveProperty('password');
  });

  test('POST /auth/login with correct credentials should return a token', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'testuser@test.com', password: '123456' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('POST /auth/login with wrong password should return 401', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'testuser@test.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
  });
});