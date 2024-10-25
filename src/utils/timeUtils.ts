import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const isValidDateString = (dateString: string): boolean => {
  const date = dayjs(dateString, 'YYYYMMDD', true);
  return date.isValid();
};

export const convertToTimeZone = (unixTimestamp: number, timeZone: string): number => {
  return dayjs.unix(unixTimestamp).tz(timeZone).unix();
};

export const generateAvailableTimeSlots = (startDay: number, serviceDuration: number, timeslotInterval: number): number[] => {
  const availableSlots: number[] = [];
  let currentSlot = startDay;

  while (currentSlot + serviceDuration <= startDay + 86400) {
    availableSlots.push(currentSlot);
    currentSlot += timeslotInterval;
  }

  return availableSlots;
};

export const createTimestamp = (start: number, interval: number): number => {
  return start + interval * 60;
};
