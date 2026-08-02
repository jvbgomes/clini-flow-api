const express = require('express');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/auth');

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/patients', authMiddleware, patientRoutes);
app.use('/appointments', authMiddleware, appointmentRoutes);

module.exports = app;