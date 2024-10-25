import { DayTimetable, Timeslot } from '../models/dayTimetable';
import { isValidDateString, convertToTimeZone, generateAvailableTimeSlots } from '../utils/timeUtils';
import dayjs from 'dayjs';

export const getDayTimetables = (
  startDayIdentifier: string,
  timezone: string,
  serviceDuration: number,
  days: number = 1,
  timeslotInterval: number = 1800,
): DayTimetable[] => {

  if (!isValidDateString(startDayIdentifier)) {
    throw new Error('유효하지 않은 날짜 형식입니다.');
  }

  const timetables: DayTimetable[] = [];

  const startOfDayUnix = dayjs(startDayIdentifier, 'YYYYMMDD').startOf('day').unix();

  for (let i = 0; i < days; i++) {
    const currentDay = convertToTimeZone(startOfDayUnix + i * 86400, timezone);
    const availableSlots = generateAvailableTimeSlots(currentDay, serviceDuration, timeslotInterval);

    const timeslots: Timeslot[] = availableSlots.map(begin_at => ({
      begin_at: begin_at.toString(),
      end_at: (begin_at + serviceDuration).toString(),
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
