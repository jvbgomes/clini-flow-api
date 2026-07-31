const express = require('express');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

app.use(express.json());

app.use('/patients', patientRoutes);
app.use('/appointments', appointmentRoutes);

module.exports = app;