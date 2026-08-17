const { body } = require('express-validator');

function isValidCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
    let d1 = (sum * 10) % 11;
    if (d1 >= 10) d1 = 0;
    if (d1 !== parseInt(cpf[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
    let d2 = (sum * 10) % 11;
    if (d2 >= 10) d2 = 0;
    return d2 === parseInt(cpf[10]);
}

function isValidPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10 || digits.length === 11;
}

module.exports = {
    create: [
        body('name')
            .notEmpty().withMessage('Name is required')
            .isString().withMessage('Name must be a string')
            .trim(),
        body('cpf')
            .notEmpty().withMessage('CPF is required')
            .customSanitizer(v => (typeof v === 'string' ? v.replace(/\D/g, '') : v))
            .isLength({ min: 11, max: 11 }).withMessage('CPF must be 11 digits')
            .isNumeric().withMessage('CPF must contain only numbers')
            .custom(cpf => {
                if (!isValidCPF(cpf)) throw new Error('Invalid CPF');
                return true;
            }),
        body('phone')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('Phone must be a string')
            .trim()
            .custom(phone => {
                if (phone && !isValidPhone(phone)) throw new Error('Phone must have 10 or 11 digits');
                return true;
            }),
        body('birthDate')
            .optional({ nullable: true, checkFalsy: true })
            .isDate().withMessage('Birth date must be a valid date'),
    ],
    update: [
        body('name')
            .optional()
            .isString().withMessage('Name must be a string')
            .trim(),
        body('cpf')
            .optional()
            .customSanitizer(v => (typeof v === 'string' ? v.replace(/\D/g, '') : v))
            .isLength({ min: 11, max: 11 }).withMessage('CPF must be 11 digits')
            .isNumeric().withMessage('CPF must contain only numbers')
            .custom(cpf => {
                if (!isValidCPF(cpf)) throw new Error('Invalid CPF');
                return true;
            }),
        body('phone')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('Phone must be a string')
            .trim()
            .custom(phone => {
                if (phone && !isValidPhone(phone)) throw new Error('Phone must have 10 or 11 digits');
                return true;
            }),
        body('birthDate')
            .optional({ nullable: true, checkFalsy: true })
            .isDate().withMessage('Birth date must be a valid date'),
    ],
};
