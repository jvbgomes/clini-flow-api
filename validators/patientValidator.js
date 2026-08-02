const { body } = require('express-validator');

module.exports = {
    create: [
        body('name')
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string'),
        body('cpf')
        .notEmpty().withMessage('CPF is required')
        .isLength({ min: 11, max: 11 }).withMessage('CPF must be 11 characters long')
        .isNumeric().withMessage('CPF must contain only numbers'),
        body('phone')
        .optional()
        .isString().withMessage('Phone must be a string'),
        body('birthDate')
        .optional()
        .isDate().withMessage('Birth date must be a valid date'),
    ],
    update: [
        body('name')
        .optional()
        .isString().withMessage('Name must be a string'),
        body('cpf').optional()
        .isLength({ min: 11, max: 11 }).withMessage('CPF must be 11 characters long')
        .isNumeric().withMessage('CPF must be 11 characters long'),
        body('phone')
        .optional()
        .isString().withMessage('Phone must be a string'),
        body('birthDate')
        .optional()
        .isDate().withMessage('Birth date must be a valid date'),
    ]

};