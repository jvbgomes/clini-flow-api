'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Patient extends Model {
        static associate(models) {
            // define association here
        }
    }

    Patient.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            cpf: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
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
        }
    );

    return Patient; 

};