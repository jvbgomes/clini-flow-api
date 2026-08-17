const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authValidator = require('../validators/authValidator');
const handleValidationErrors = require('../middlewares/handleValidationErrors');
const authMiddleware = require('../middlewares/auth');

router.post('/register', authValidator.register, handleValidationErrors, authController.register);
router.post('/login', authValidator.login, handleValidationErrors, authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.me);
router.post('/change-password', authMiddleware, authValidator.changePassword, handleValidationErrors, authController.changePassword);

module.exports = router;
