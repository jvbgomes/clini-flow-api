const { Patient } = require('../models');

module.exports = {
    async create(req, res) {
        try {
            const patient = await Patient.create(req.body);

            return res.status(201).json(patient);
        } catch (error) {
            return res.status(400).json({message: error.message});
        }
    },
    async findAll(req, res) {
        try {
            const patients = await Patient.findAll();

            return res.status(200).json(patients)
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    },
    async findOne(req, res) {
        try {
            const patient = await Patient.findByPk(req.params.id, {
                include: 'appointments',
            });

            if(!patient) {
                return res.status(404).json({message: 'Patient not found'});
            }

            return res.status(200).json(patient);
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    },
    async update(req, res) {
        try {
            const patient = await Patient.findByPk(req.params.id);

            if(!patient) {
                return res.status(404).json({message: 'Patient not found'});
            }

            const updatedPatient = await patient.update(req.body);

            return res.status(200).json(updatedPatient);
        } catch (error) {
            return res.status(400).json({message: error.message});
        }
    },
    async delete(req, res) {
        try {
            const patient = await Patient.findByPk(req.params.id);

            if (!patient) {
                return res.status(404).json({message: 'Patient not found'});
            }

            const deletedPatient = await patient.destroy();

            return res.status(200).json({message: 'Patient deleted'});
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }
};