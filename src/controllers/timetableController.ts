import { Request, Response } from 'express';
import { getDayTimetables } from '../services/timetableService';
import { handleError } from '../utils/errorHandler';

export const TimeSlotController = {
  getTimeSlots: (req: Request, res: Response) => {
    try {
      const dayTimetables = getDayTimetables(req.body);
      res.status(200).json(dayTimetables);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        handleError(res, error, '타임 슬롯 생성 중 오류 발생');
      }
    }
  },
};
