const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../utils/tokenBlacklist');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];

    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ message: 'Token has been revoked' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.userId = decoded.id;
        req.token = token;
        return next();
    });
};
