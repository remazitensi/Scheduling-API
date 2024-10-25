import express from 'express';
import { TimeSlotController } from '../controllers/timetableController';

const router = express.Router();

router.post('/getTimeSlots', TimeSlotController.getTimeSlots);

export default router;
