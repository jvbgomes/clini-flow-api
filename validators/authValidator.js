const { body } = require('express-validator');

module.exports = {
    register: [
        body('name')
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string'),
        body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
        body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    login: [
        body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
        body('password')
        .notEmpty().withMessage('Password is required'),
    ]
};