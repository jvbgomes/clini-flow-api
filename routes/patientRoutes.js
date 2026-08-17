const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const patientValidator = require('../validators/patientValidator');
const handleValidationErrors = require('../middlewares/handleValidationErrors');

router.post('/', patientValidator.create, handleValidationErrors, patientController.create);
router.get('/', patientController.findAll);
router.get('/:id', patientController.findOne);
router.get('/:id/appointments', patientController.findAppointments);
router.put('/:id', patientValidator.update, handleValidationErrors, patientController.update);
router.delete('/:id', patientController.remove);

module.exports = router;
