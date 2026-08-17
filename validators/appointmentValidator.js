const { body } = require('express-validator');

module.exports = {
    create: [
        body('patientId')
            .notEmpty().withMessage('patientId is required')
            .isInt().withMessage('patientId must be an integer'),
        body('date')
            .notEmpty().withMessage('Date is required')
            .isISO8601().withMessage('Invalid date format'),
        body('status')
            .optional()
            .isIn(['scheduled', 'completed', 'cancelled'])
            .withMessage('Invalid status'),
        body('notes')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('Notes must be a string')
            .trim(),
    ],
    update: [
        body('date')
            .optional()
            .isISO8601().withMessage('Invalid date format'),
        body('status')
            .optional()
            .isIn(['scheduled', 'completed', 'cancelled'])
            .withMessage('Invalid status'),
        body('notes')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('Notes must be a string')
            .trim(),
    ],
    status: [
        body('status')
            .notEmpty().withMessage('Status is required')
            .isIn(['scheduled', 'completed', 'cancelled'])
            .withMessage('Invalid status'),
    ],
};
