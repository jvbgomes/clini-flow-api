const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authValidator = require('../validators/authValidator');
const handleValidationErrors = require('../middlewares/handleValidationErrors');

router.post('/register', authValidator.register, handleValidationErrors, authController.register);
router.post('/login', authValidator.login, handleValidationErrors, authController.login);

module.exports = router;