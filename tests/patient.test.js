const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const jwt = require('jsonwebtoken');

const fakeToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET, {expiresIn: '1h'});

describe('Patient endpoints', () => {
    afterAll(async () => {
        await sequelize.close();
    });

    test('GET /patients without token should return 401', async () => {
        const response = await request(app).get('/patients');
        expect(response.status).toBe(401);
    });

    test('POST /patients with valid data should return 201', async () => {
        const response = await request(app)
            .post('/patients')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ name: 'Test Patient', cpf: '11122233344' });
            
        expect(response.status).toBe(201);
        expect(response.body.name).toBe('Test Patient');
    });

    test('POST /patient without name should return 400', async () => {
        const response = await request(app)
            .post('/patients')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ cpf: '55566677788' });
        
        expect(response.status).toBe(400);    
    });
});

