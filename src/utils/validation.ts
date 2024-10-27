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

export const isValidBoolean = (value: any): string | null => {
  return typeof value === 'boolean' ? null : '유효하지 않은 Boolean 값입니다.';
};

// 요청 본문을 검증하는 함수
export const validateRequestBody = (body: RequestBody): string[] => {
  const errors: string[] = [];
  const { start_day_identifier, timezone_identifier, service_duration, days, is_ignore_schedule, is_ignore_workhour } = body;

  // 날짜 형식 검증
  if (typeof start_day_identifier !== 'string' || !isValidDateString(start_day_identifier)) {
    errors.push('유효하지 않은 날짜 형식입니다.');
  }

  // 타임존 검증
  const timezoneError = isValidTimeZone(timezone_identifier);
  if (timezoneError) {
    errors.push(timezoneError);
  }

  // 서비스 지속 시간 검증
  const durationError = isValidServiceDuration(service_duration);
  if (durationError) {
    errors.push(durationError);
  }

  // 일 수 검증
  if (days !== undefined) {
    const daysError = isValidDays(days);
    if (daysError) {
      errors.push(daysError);
    }
  }

  // is_ignore_schedule 검증
  if (is_ignore_schedule !== undefined) {
    const ignoreScheduleError = isValidBoolean(is_ignore_schedule);
    if (ignoreScheduleError) {
      errors.push(ignoreScheduleError);
    }
  }

  // is_ignore_workhour 검증
  if (is_ignore_workhour !== undefined) {
    const ignoreWorkhourError = isValidBoolean(is_ignore_workhour);
    if (ignoreWorkhourError) {
      errors.push(ignoreWorkhourError);
    }
  }

  return errors;
};