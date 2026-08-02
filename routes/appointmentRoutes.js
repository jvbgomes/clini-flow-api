const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const appointmentValidator = require("../validators/appointmentValidator");
const handleValidationErrors = require("../middlewares/handleValidationErrors");

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment scheduling
 */

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, date]
 *             properties:
 *               patientId: { type: integer }
 *               date: { type: string, format: date-time }
 *               status: { type: string, enum: [scheduled, completed, cancelled] }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Appointment created }
 *       400: { description: Validation error }
 *       404: { description: Patient not found }
 *   get:
 *     summary: List all appointments
 *     tags: [Appointments]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of appointments }
 */

router.post('/', appointmentValidator.create, handleValidationErrors, appointmentController.create);
router.get('/', appointmentController.findAll);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get an appointment by id
 *     tags: [Appointments]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Appointment found }
 *       404: { description: Appointment not found }
 *   put:
 *     summary: Update an appointment
 *     tags: [Appointments]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Appointment updated }
 *       404: { description: Appointment not found }
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Appointments]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Appointment deleted }
 *       404: { description: Appointment not found }
 */

router.get('/:id', appointmentController.findOne);
router.put('/:id', appointmentValidator.update, handleValidationErrors, appointmentController.update);
router.delete('/:id', appointmentController.remove);

module.exports = router;
