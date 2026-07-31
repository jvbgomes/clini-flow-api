'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Appointment extends Model {
        static associate(models) {
            Appointment.belongsTo(models.Patient, { 
                foreignKey: 'patientId',
                as: 'patient',
            });
        }
    }

    Appointment.init(
        {
        patientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'patient_id',
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
            allowNull: false,
            defaultValue: 'scheduled',
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, 
    {
        sequelize,
        modelName: 'Appointment',
        tableName: 'appointments',
        underscored: true,
    }
);

    return Appointment;
};