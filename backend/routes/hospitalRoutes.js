import express from 'express';
import { getPatients, addPatient, getAppointments } from '../controllers/hospitalController.js';

const router = express.Router();

router.get('/patients', getPatients);
router.post('/patients', addPatient);
router.get('/appointments', getAppointments);

export default router;
