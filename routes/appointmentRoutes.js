const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const appointmentValidator = require('../validators/appointmentValidator');
const handleValidationErrors = require('../middlewares/handleValidationErrors');

router.get('/today', appointmentController.findToday);
router.get('/upcoming', appointmentController.findUpcoming);
router.post('/', appointmentValidator.create, handleValidationErrors, appointmentController.create);
router.get('/', appointmentController.findAll);
router.get('/:id', appointmentController.findOne);
router.put('/:id', appointmentValidator.update, handleValidationErrors, appointmentController.update);
router.patch('/:id/status', appointmentValidator.status, handleValidationErrors, appointmentController.updateStatus);
router.delete('/:id', appointmentController.remove);

module.exports = router;
