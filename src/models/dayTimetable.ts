import { Timeslot } from './timeslot';

export interface DayTimetable {
  start_of_day: number;
  day_modifier: number;
  is_day_off: boolean;
  timeslots: Timeslot[];
}
export { Timeslot };

