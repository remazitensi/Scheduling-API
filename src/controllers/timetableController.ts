import { Request, Response } from 'express';
import { getDayTimetables } from '../services/timetableService';
import { DayTimetable } from '../models/dayTimetable';

export const TimeSlotController = {
  getTimeSlots: (req: Request, res: Response) => {
    const {
      start_day_identifier,
      timezone_identifier,
      service_duration,
      days = 1,
      timeslot_interval = 1800,
    } = req.body;

    try {
      const dayTimetables: DayTimetable[] = getDayTimetables(
        start_day_identifier,
        timezone_identifier,
        service_duration,
        days,
        timeslot_interval,
      );

      res.status(200).json(dayTimetables);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: '타임 슬롯 생성 중 오류 발생' });
    }
  },
};
