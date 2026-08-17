const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errs = errors.array();
        return res.status(400).json({
            message: errs[0]?.msg || 'Validation failed',
            errors: errs.map(e => ({ field: e.path, message: e.msg })),
        });
    }

    next();
};
