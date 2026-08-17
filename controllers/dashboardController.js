const { Op } = require('sequelize');
const { Appointment, Patient, sequelize } = require('../models');

module.exports = {
    async stats(req, res) {
        try {
            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
            const weekEnd = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000);
            const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

            const [
                totalPatients,
                todayCount,
                scheduledCount,
                completedCount,
                cancelledCount,
                upcomingAppointments,
                monthlyRaw,
            ] = await Promise.all([
                Patient.count(),
                Appointment.count({
                    where: { date: { [Op.gte]: todayStart, [Op.lt]: todayEnd } },
                }),
                Appointment.count({ where: { status: 'scheduled' } }),
                Appointment.count({ where: { status: 'completed' } }),
                Appointment.count({ where: { status: 'cancelled' } }),
                Appointment.findAll({
                    where: {
                        date: { [Op.gte]: todayStart, [Op.lt]: weekEnd },
                        status: 'scheduled',
                    },
                    include: 'patient',
                    order: [['date', 'ASC']],
                    limit: 10,
                }),
                Appointment.findAll({
                    attributes: [
                        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('date')), 'month'],
                        [sequelize.fn('COUNT', '*'), 'count'],
                    ],
                    where: { date: { [Op.gte]: sixMonthsAgo } },
                    group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('date'))],
                    order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('date')), 'ASC']],
                    raw: true,
                }),
            ]);

            const monthlyData = monthlyRaw.map(d => ({
                month: new Date(d.month).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
                count: Number(d.count),
            }));

            return res.status(200).json({
                totalPatients,
                todayCount,
                scheduledCount,
                completedCount,
                cancelledCount,
                upcomingAppointments,
                monthlyData,
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
};
