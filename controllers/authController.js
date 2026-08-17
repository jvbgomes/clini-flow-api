const jwt = require('jsonwebtoken');
const { User } = require('../models');
const tokenBlacklist = require('../utils/tokenBlacklist');

module.exports = {
    async register(req, res) {
        try {
            const exitingUser = await User.findOne({ where: { email: req.body.email } });
            if (exitingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            const user = await User.create(req.body);
            return res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isValid = await user.checkPassword(password);
            if (!isValid) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: '1d',
            });

            return res.status(200).json({
                user: { id: user.id, name: user.name, email: user.email },
                token,
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async logout(req, res) {
        tokenBlacklist.add(req.token);
        return res.status(200).json({ message: 'Logged out successfully' });
    },

    async me(req, res) {
        try {
            const user = await User.findByPk(req.userId, {
                attributes: ['id', 'name', 'email'],
            });
            if (!user) return res.status(404).json({ message: 'User not found' });
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await User.findByPk(req.userId);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const isValid = await user.checkPassword(currentPassword);
            if (!isValid) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            await user.update({ password: newPassword });
            tokenBlacklist.add(req.token);

            return res.status(200).json({ message: 'Password changed successfully. Please log in again.' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
};
