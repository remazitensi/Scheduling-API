export interface RequestBody { 
    start_day_identifier: string; 
    timezone_identifier: string; 
    service_duration: number; 
    days?: number; 
    timeslot_interval?: number; 
    is_ignore_schedule?: boolean; 
    is_ignore_workhour?: boolean; 
  }