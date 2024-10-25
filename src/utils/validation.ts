import { isValidDateString } from "./timeUtils";
import { RequestBody } from "../interfaces/requestBody";

export const isValidUnixTimestamp = (timestamp: number): string | null => {
  return Number.isInteger(timestamp) && timestamp > 0 
    ? null 
    : '유효하지 않은 Unix 타임스탬프입니다.';
};

export const isValidTimeZone = (timeZone: string): string | null => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return null;
  } catch {
    return '유효하지 않은 타임존입니다.';
  }
};

export const isValidServiceDuration = (duration: number): string | null => {
  return duration > 0 
    ? null 
    : '서비스 지속 시간이 유효하지 않습니다.';
};

export const isValidDays = (days: number): string | null => {
  return Number.isInteger(days) && days >= 1 
    ? null 
    : '유효하지 않은 일 수입니다.';
};

export const validateRequestBody = (body: RequestBody): string[] => {
    const errors: string[] = [];
    const { start_day_identifier, timezone_identifier, service_duration, days } = body;
  
    if (typeof start_day_identifier !== 'string' || !isValidDateString(start_day_identifier)) {
      errors.push('유효하지 않은 날짜 형식입니다.');
    }
  
    const timezoneError = isValidTimeZone(timezone_identifier);
    if (timezoneError) {
      errors.push(timezoneError);
    }
    
    const durationError = isValidServiceDuration(service_duration);
    if (durationError) {
      errors.push(durationError);
    }
    
    if (days !== undefined) {
      const daysError = isValidDays(days);
      if (daysError) {
        errors.push(daysError);
      }
    }
  
    return errors;
  };
  