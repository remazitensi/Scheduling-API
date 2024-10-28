import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Timeslot } from '../models/dayTimetable';

dayjs.extend(utc);
dayjs.extend(timezone);

// YYYYMMDD 형식의 날짜 문자열 유효성 검사
export const isValidDateString = (dateString: string): boolean => {
  const date = dayjs(dateString, 'YYYYMMDD', true);
  return date.isValid() && date.format('YYYYMMDD') === dateString;
};

// 유닉스 타임스탬프를 주어진 시간대로 변환
export const convertToTimeZone = (unixTimestamp: number, timeZone: string): number => {
  return dayjs.unix(unixTimestamp).tz(timeZone).unix();
};

// 가능한 시간 슬롯 생성
export const generateAvailableTimeSlots = (
  startDay: number,
  serviceDuration: number,
  timeslotInterval: number
): Timeslot[] => {
  const availableSlots: Timeslot[] = [];
  let currentSlot = startDay;

  while (currentSlot + serviceDuration <= startDay + 86400) {
    availableSlots.push({
      begin_at: currentSlot,
      end_at: currentSlot + serviceDuration,
    });
    currentSlot += timeslotInterval;
  }

  return availableSlots;
};

// 시작과 간격에 따라 타임스탬프 생성
export const createTimestamp = (start: number, interval: number): number => {
  return start + interval * 60;
};