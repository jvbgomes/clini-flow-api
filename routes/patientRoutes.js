const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const patientValidator = require('../validators/patientValidator');
const handleValidationErrors = require('../middlewares/handleValidationErrors');

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient management
 */

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, cpf]
 *             properties:
 *               name: { type: string }
 *               cpf: { type: string }
 *               phone: { type: string }
 *               birthDate: { type: string, format: date }
 *     responses:
 *       201: { description: Patient created }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 *   get:
 *     summary: List all patients
 *     tags: [Patients]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of patients }
 *       401: { description: Unauthorized }
 */

router.post('/', patientValidator.create, handleValidationErrors, patientController.create);
router.get('/', patientController.findAll);

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get a patient by id
 *     tags: [Patients]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Patient found }
 *       404: { description: Patient not found }
 *   put:
 *     summary: Update a patient
 *     tags: [Patients]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Patient updated }
 *       404: { description: Patient not found }
 *   delete:
 *     summary: Delete a patient
 *     tags: [Patients]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Patient deleted }
 *       404: { description: Patient not found }
 */

router.get('/:id', patientController.findOne);
router.put('/:id', patientValidator.update, handleValidationErrors, patientController.update);
router.delete('/:id', patientController.remove);

module.exports = router;