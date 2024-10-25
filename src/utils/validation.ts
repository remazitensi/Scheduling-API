import { isValidDateString } from "./timeUtils";

export const isValidUnixTimestamp = (timestamp: number): boolean => {
    return Number.isInteger(timestamp) && timestamp > 0;
  };
  
  export const isValidTimeZone = (timeZone: string): boolean => {
    try {
      Intl.DateTimeFormat(undefined, { timeZone });
      return true;
    } catch {
      return false;
    }
  };
  
  export const isValidServiceDuration = (duration: number): boolean => {
    return duration > 0;
  };
  
  export const isValidRequestBody = (body: any): boolean => {
    const { start_day_identifier, timezone_identifier, service_duration } = body;
  
    return (
      typeof start_day_identifier === 'string' &&
      isValidDateString(start_day_identifier) &&
      typeof timezone_identifier === 'string' &&
      isValidTimeZone(timezone_identifier) &&
      isValidServiceDuration(service_duration)
    );
  };
  