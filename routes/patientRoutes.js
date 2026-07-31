const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.post('/', patientController.create);
router.get('/', patientController.findAll);
router.get('/:id', patientController.findOne);
router.put('/:id', patientController.update);
router.delete('/:id', patientController.remove);

module.exports = router;