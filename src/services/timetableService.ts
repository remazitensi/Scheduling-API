import { DayTimetable, Timeslot } from '../models/dayTimetable';
import { convertToTimeZone, generateAvailableTimeSlots } from '../utils/timeUtils';
import { validateRequestBody } from '../utils/validation';
import { RequestBody } from '../interfaces/requestBody';
import dayjs from 'dayjs';
import events from '../data/events.json';
import workhours from '../data/workhours.json';

const doesOverlap = (slot: Timeslot, event: { begin_at: number; end_at: number }): boolean => {
  const slotBegin = parseInt(slot.begin_at);
  const slotEnd = parseInt(slot.end_at);
  return slotBegin < event.end_at && slotEnd > event.begin_at;
};

const doesWorkhourOverlap = (slot: Timeslot, workhour: { open_interval: number; close_interval: number }, startOfDayUnix: number): boolean => {
  const slotBegin = parseInt(slot.begin_at);
  const slotEnd = parseInt(slot.end_at);
  
  const openInterval = startOfDayUnix + workhour.open_interval;
  const closeInterval = startOfDayUnix + workhour.close_interval;

  return slotBegin < closeInterval && slotEnd > openInterval;
};

const filterTimeslots = (timeslots: Timeslot[], body: RequestBody, startOfDayUnix: number): Timeslot[] => {
  // step 2: is_ignore_schedule가 false인 경우 이벤트 데이터와 겹치는 타임슬롯을 필터링
  if (!body.is_ignore_schedule) {
    timeslots = timeslots.filter(slot => 
      !events.some(event => doesOverlap(slot, event))
    );
  }

  // step 3: is_ignore_workhour가 false인 경우 근무시간 데이터와 겹치는 타임슬롯을 필터링
  if (!body.is_ignore_workhour) {
    timeslots = timeslots.filter(slot => 
      !workhours.some(workhour => doesWorkhourOverlap(slot, workhour, startOfDayUnix))
    );
  }

  return timeslots;
};

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
  // step 1: 시작일을 Unix timestamp로 변환하여 UTC 기준으로 시작하는 timestamp 생성
  const startOfDayUnix = dayjs.utc(start_day_identifier, 'YYYYMMDD').startOf('day').unix();

  for (let i = 0; i < days; i++) {
    const currentDayUnix = startOfDayUnix + i * 86400;
    const currentDay = convertToTimeZone(currentDayUnix, timezone_identifier);
    const availableSlots = generateAvailableTimeSlots(currentDayUnix, service_duration, timeslot_interval);

    const timeslots: Timeslot[] = availableSlots.map(begin_at => ({
      begin_at: begin_at.toString(),
      end_at: (begin_at + service_duration).toString(),
    }));

    const filteredTimeslots = filterTimeslots(timeslots, body, startOfDayUnix);

    timetables.push({
      start_of_day: currentDay,
      day_modifier: i,
      is_day_off: false,
      timeslots: filteredTimeslots,
    });
  }

  return timetables;
};