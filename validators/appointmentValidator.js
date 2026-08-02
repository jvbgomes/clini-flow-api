const { body } = require('express-validator');

module.exports = {
    create: [
        body('patientId')
        .notEmpty().withMessage('patientId is required')
        .isInt().withMessage('patientId must be an integer'),
        body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Invalid date. Use YYYY-MM-DD format'),
        body('status')
        .optional()
        .isIn(['scheduled', 'completed', 'cancelled'])
        .withMessage('Invalid status.'),
        body('notes')
        .optional()
        .isString().withMessage('Notes must be a string')
    ],
    update: [
        body('date')
        .optional()
        .isISO8601().withMessage('Invalid date'),
        body('status')
        .optional()
        .isIn(['scheduled', 'completed', 'cancelled'])
        .withMessage('Invalid status'),
        body('notes')
        .optional()
        .isString().withMessage('Notes must be a string'),
    ],
};