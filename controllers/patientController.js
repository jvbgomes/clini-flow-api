const { Op } = require('sequelize');
const { Patient, Appointment, sequelize } = require('../models');

const SORT_COLUMNS = {
    name: 'name',
    cpf: 'cpf',
    birthDate: 'birth_date',
    appointments: sequelize.literal(
        '(SELECT COUNT(*) FROM appointments WHERE appointments.patient_id = "Patient".id AND appointments.deleted_at IS NULL)'
    ),
};

module.exports = {
    async create(req, res) {
        try {
            const patient = await Patient.create(req.body);
            return res.status(201).json(patient);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },

    async findAll(req, res) {
        try {
            const page = Math.max(1, parseInt(req.query.page) || 1);
            const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
            const offset = (page - 1) * limit;
            const sortBy = SORT_COLUMNS[req.query.sortBy] || 'name';
            const sortDir = req.query.sortDir === 'desc' ? 'DESC' : 'ASC';

            const where = {};
            if (req.query.search) {
                const term = req.query.search.trim();
                where[Op.or] = [
                    { name: { [Op.iLike]: `%${term}%` } },
                    { cpf: { [Op.like]: `%${term.replace(/\D/g, '')}%` } },
                ];
            }

            const appointmentCountLiteral = sequelize.literal(
                '(SELECT COUNT(*)::INTEGER FROM appointments WHERE appointments.patient_id = "Patient".id AND appointments.deleted_at IS NULL)'
            );

            const { count, rows } = await Patient.findAndCountAll({
                where,
                attributes: {
                    include: [[appointmentCountLiteral, 'appointmentCount']],
                },
                limit,
                offset,
                order: [[sortBy, sortDir]],
                distinct: true,
            });

            return res.status(200).json({
                data: rows,
                total: count,
                page,
                totalPages: Math.max(1, Math.ceil(count / limit)),
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async findOne(req, res) {
        try {
            const patient = await Patient.findByPk(req.params.id, {
                include: [{
                    model: Appointment,
                    as: 'appointments',
                    order: [['date', 'DESC']],
                }],
            });
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            return res.status(200).json(patient);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async findAppointments(req, res) {
        try {
            const patient = await Patient.findByPk(req.params.id);
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            const appointments = await Appointment.findAll({
                where: { patientId: req.params.id },
                order: [['date', 'DESC']],
            });
            return res.status(200).json(appointments);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async update(req, res) {
        try {
            const patient = await Patient.findByPk(req.params.id);
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            const updated = await patient.update(req.body);
            return res.status(200).json(updated);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },

    async remove(req, res) {
        try {
            const patient = await Patient.findByPk(req.params.id);
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            await patient.destroy();
            return res.status(200).json({ message: 'Patient deleted' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
};
