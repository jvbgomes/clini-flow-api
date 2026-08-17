'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Patient extends Model {
        static associate(models) {
            Patient.hasMany(models.Appointment, {
                foreignKey: 'patientId',
                as: 'appointments',
            });
        }
    }

    Patient.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                set(value) { this.setDataValue('name', typeof value === 'string' ? value.trim() : value); },
            },
            cpf: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                set(value) { this.setDataValue('cpf', typeof value === 'string' ? value.replace(/\D/g, '') : value); },
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
                set(value) { this.setDataValue('phone', typeof value === 'string' ? value.trim() : value); },
            },
            birthDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                field: 'birth_date',
            },
        },
        {
            sequelize,
            modelName: 'Patient',
            tableName: 'patients',
            underscored: true,
            paranoid: true,
        }
    );

    return Patient;
};
