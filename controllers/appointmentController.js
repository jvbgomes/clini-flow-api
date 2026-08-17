const { Op } = require('sequelize');
const { Appointment, Patient } = require('../models');

const SORT_COLUMNS = {
    date: 'date',
    status: 'status',
    patient: '$patient.name$',
};

async function checkConflict(patientId, date, excludeId = null) {
    const window = 30 * 60 * 1000;
    const dateMs = new Date(date).getTime();
    const where = {
        patientId,
        status: 'scheduled',
        date: { [Op.between]: [new Date(dateMs - window), new Date(dateMs + window)] },
    };
    if (excludeId) where.id = { [Op.ne]: excludeId };
    return Appointment.findOne({ where });
}

module.exports = {
    async create(req, res) {
        try {
            const { patientId, date } = req.body;
            const patient = await Patient.findByPk(patientId);
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }

            const conflict = await checkConflict(patientId, date);
            if (conflict) {
                const conflictTime = new Date(conflict.date).toLocaleString('pt-BR', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                });
                return res.status(409).json({
                    message: `Patient already has an appointment at ${conflictTime}. Please choose a different time.`,
                });
            }

            const appointment = await Appointment.create(req.body);
            return res.status(201).json(appointment);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },

    async findAll(req, res) {
        try {
            const page = Math.max(1, parseInt(req.query.page) || 1);
            const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
            const offset = (page - 1) * limit;
            const sortByKey = req.query.sortBy || 'date';
            const sortBy = SORT_COLUMNS[sortByKey] || 'date';
            const sortDir = req.query.sortDir === 'desc' ? 'DESC' : 'ASC';

            const where = {};
            if (req.query.status) where.status = req.query.status;
            if (req.query.patientId) where.patientId = Number(req.query.patientId);
            if (req.query.from || req.query.to) {
                where.date = {};
                if (req.query.from) where.date[Op.gte] = new Date(req.query.from);
                if (req.query.to) where.date[Op.lte] = new Date(req.query.to + 'T23:59:59');
            }
            if (req.query.search) {
                where['$patient.name$'] = { [Op.iLike]: `%${req.query.search.trim()}%` };
            }

            const countWhere = { ...where };
            delete countWhere['$patient.name$'];

            const order = sortBy === '$patient.name$'
                ? [[{ model: Patient, as: 'patient' }, 'name', sortDir]]
                : [[sortBy, sortDir]];

            const { count, rows } = await Appointment.findAndCountAll({
                where,
                include: [{ model: Patient, as: 'patient', required: !!req.query.search }],
                order,
                limit,
                offset,
                distinct: true,
                subQuery: false,
            });

            const allCounts = await Appointment.findAll({
                attributes: ['status', [Appointment.sequelize.fn('COUNT', '*'), 'count']],
                group: ['status'],
                raw: true,
            });
            const statusCounts = { scheduled: 0, completed: 0, cancelled: 0 };
            allCounts.forEach(r => { statusCounts[r.status] = Number(r.count); });

            return res.status(200).json({
                data: rows,
                total: count,
                page,
                totalPages: Math.max(1, Math.ceil(count / limit)),
                statusCounts,
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async findToday(req, res) {
        try {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
            const appointments = await Appointment.findAll({
                where: { date: { [Op.gte]: start, [Op.lt]: end } },
                include: 'patient',
                order: [['date', 'ASC']],
            });
            return res.status(200).json(appointments);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async findUpcoming(req, res) {
        try {
            const now = new Date();
            const days = parseInt(req.query.days) || 7;
            const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
            const appointments = await Appointment.findAll({
                where: {
                    date: { [Op.gte]: now, [Op.lte]: end },
                    status: 'scheduled',
                },
                include: 'patient',
                order: [['date', 'ASC']],
                limit: 50,
            });
            return res.status(200).json(appointments);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async findOne(req, res) {
        try {
            const appointment = await Appointment.findByPk(req.params.id, {
                include: 'patient',
            });
            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }
            return res.status(200).json(appointment);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async update(req, res) {
        try {
            const appointment = await Appointment.findByPk(req.params.id);
            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }

            const newDate = req.body.date || appointment.date;
            const newPatientId = req.body.patientId || appointment.patientId;
            if (req.body.date || req.body.patientId) {
                const conflict = await checkConflict(newPatientId, newDate, appointment.id);
                if (conflict) {
                    const conflictTime = new Date(conflict.date).toLocaleString('pt-BR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                    });
                    return res.status(409).json({
                        message: `Patient already has an appointment at ${conflictTime}. Please choose a different time.`,
                    });
                }
            }

            const updated = await appointment.update(req.body);
            return res.status(200).json(updated);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },

    async updateStatus(req, res) {
        try {
            const appointment = await Appointment.findByPk(req.params.id);
            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }
            const updated = await appointment.update({ status: req.body.status });
            return res.status(200).json(updated);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },

    async remove(req, res) {
        try {
            const appointment = await Appointment.findByPk(req.params.id);
            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }
            await appointment.destroy();
            return res.status(200).json({ message: 'Appointment deleted' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
};
