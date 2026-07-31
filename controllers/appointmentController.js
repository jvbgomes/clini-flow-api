const { Appointment, Patient } = require('../models');

module.exports = {
    async create(req, res) {
        try {
            const patient = await Patient.findByPk(req.body.patientId);

            if (!patient) {
                return res.status(404).json({message: 'Patient not found'});
            }

            const appointment = await Appointment.create(req.body);
            return res.status(201).json(appointment);
        } 
        catch (error) {
            return res.status(400).json({message: error.message});
        }
    },
    
    async findAll(req, res) {
        try {
            const appointments = await Appointment.findAll({
                include: 'patient',
                order: [['date', 'ASC']],
            });

            return res.status(200).json(appointments);  
        }
        catch (error) {
            return res.status(500).json({message: error.message});
        }
    },

    async findOne(req, res) {
        try {
            const appointment = await Appointment.findByPk(req.params.id, {
                include: 'patient',
            });

            if (!appointment) {
                return res.status(404).json({message: 'Appointment not found'});
            }

            return res.status(200).json(appointment);
        } 
        catch (error) {
            return res.status(500).json({message: error.message});
        }
    },

    async update(req, res) {
        try {
            const appointment = await Appointment.findByPk(req.params.id);

            if (!appointment) {
                return res.status(404).json({message: 'Appointment not found'});
            }

            const updatedAppointment = await appointment.update(req.body);
            return res.status(200).json(updatedAppointment);
        } 
        catch (error) {
            return res.status(400).json({message: error.message});
        }
    },

    async remove(req, res) {
        try {
            const appointment = await Appointment.findByPk(req.params.id);

            if (!appointment) {
                return res.status(404).json({message: 'Appointment not found'});
            }

            await appointment.destroy();
            return res.status(204).send();
        } 
        catch (error) {
            return res.status(500).json({message: error.message});
        }
    },
};