const request = require('supertest');
const app = require('../app');
const { sequelize, Patient } = require('../models');
const jwt = require('jsonwebtoken');

const fakeToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET, {expiresIn: '1h'});

describe('Appointment endpoints', () => {
    let patient;

    beforeAll(async () => {
        await sequelize.sync({ force: true });
        patient = await Patient.create({ 
            name: 'Test Patient', 
            cpf: '99988877766' });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('GET /appointments without token should return 401', async () => {
        const response = await request(app).get('/appointments');
        expect(response.status).toBe(401);
    });

    test('POST /appointments with valid data should return 201', async () => {
        const response = await request(app)
            .post('/appointments')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ patientId: patient.id ,date: '2026-08-15 10:00:00' });
            
        expect(response.status).toBe(201);
        expect(response.body.patientId).toBe(patient.id);
    });

    test('POST /appointments with non-existent patientId should return 404', async () => {
        const response = await request(app)
            .post('/appointments')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ patientId: 999999, date: '2026-08-15 10:00:00', });
            
        expect(response.status).toBe(404);
    });
});    