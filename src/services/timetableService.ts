import { DayTimetable, Timeslot } from '../models/dayTimetable';
import { convertToTimeZone, generateAvailableTimeSlots } from '../utils/timeUtils';
import dayjs from 'dayjs';
import { validateRequestBody } from '../utils/validation';
import { RequestBody } from '../interfaces/requestBody';

export const getDayTimetables = (body: RequestBody): DayTimetable[] => {
    const errors = validateRequestBody(body);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  
    const {
      start_day_identifier,
      timezone_identifier,
      service_duration,
      days = 1,
      timeslot_interval = 1800,
    } = body;

  const timetables: DayTimetable[] = [];
  const startOfDayUnix = dayjs(start_day_identifier, 'YYYYMMDD').startOf('day').unix();

  for (let i = 0; i < days; i++) {
    const currentDay = convertToTimeZone(startOfDayUnix + i * 86400, timezone_identifier);
    const availableSlots = generateAvailableTimeSlots(currentDay, service_duration, timeslot_interval);

    const timeslots: Timeslot[] = availableSlots.map(begin_at => ({
      begin_at: begin_at.toString(),
      end_at: (begin_at + service_duration).toString(),
    }));

    timetables.push({
      start_of_day: currentDay,
      day_modifier: i,
      is_day_off: false, // Step 1: 주어진 파라미터에 따라 타임슬롯 반환
      timeslots,
    });
  }

  // TODO: Step 2 - is_ignore_schedule 처리 로직 구현
  // 주어진 events.json 파일을 참조하여 Timeslot과 겹치지 않도록 필터링하는 기능 추가

  // TODO: Step 3 - is_ignore_workhour 처리 로직 구현
  // 주어진 workhours.json 파일을 참조하여 Timeslot과 겹치지 않도록 필터링하는 기능 추가
  return timetables;
};
