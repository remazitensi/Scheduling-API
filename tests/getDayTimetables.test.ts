import { getDayTimetables } from '../src/services/timetableService';
import { RequestBody } from '../src/interfaces/requestBody';

jest.mock('../src/data/events.json', () => ([ 
  { begin_at: 1620508800, end_at: 1620512400 },
  { begin_at: 1620595200, end_at: 1620598800 },
]));

jest.mock('../src/data/workhours.json', () => ([ 
  { close_interval: 72000, is_day_off: false, key: 'fri', open_interval: 36000, weekday: 6 },
  { close_interval: 36900, is_day_off: false, key: 'mon', open_interval: 36900, weekday: 2 },
  { close_interval: 72000, is_day_off: false, key: 'sat', open_interval: 36000, weekday: 7 },
  { close_interval: 72000, is_day_off: false, key: 'sun', open_interval: 36000, weekday: 1 },
  { close_interval: 72000, is_day_off: false, key: 'thu', open_interval: 36000, weekday: 5 },
  { close_interval: 72000, is_day_off: false, key: 'tue', open_interval: 36000, weekday: 3 },
  { close_interval: 72000, is_day_off: false, key: 'wed', open_interval: 36000, weekday: 4 },
]));

describe('getDayTimetables', () => {
  const testCases = [
    { start_day_identifier: '20210509', timezone: 'Asia/Seoul' },
    { start_day_identifier: '20210510', timezone: 'Asia/Seoul' },
    { start_day_identifier: '20210511', timezone: 'Asia/Seoul' },
  ];

  testCases.forEach(({ start_day_identifier, timezone }) => {
    describe(`start_day_identifier: ${start_day_identifier}`, () => {
      it('is_ignore_schedule가 false이고 is_ignore_workhour가 false일 때, 일정 및 근무 시간과 겹치지 않는 슬롯을 반환', () => {
        const body: RequestBody = {
          start_day_identifier,
          timezone_identifier: timezone,
          service_duration: 3600,
          days: 1,
          timeslot_interval: 1800,
          is_ignore_schedule: false,
          is_ignore_workhour: false,
        };
        const result = getDayTimetables(body);
        expect(result).toBeDefined();
        expect(result.length).toBe(1);
        expect(result[0].timeslots.length).toBeGreaterThan(0);
      });

      it('is_ignore_schedule가 true이고 is_ignore_workhour가 false일 때, 근무 시간만 고려하여 슬롯을 반환', () => {
        const body: RequestBody = {
          start_day_identifier,
          timezone_identifier: timezone,
          service_duration: 3600,
          days: 1,
          timeslot_interval: 1800,
          is_ignore_schedule: true,
          is_ignore_workhour: false,
        };
        const result = getDayTimetables(body);
        expect(result).toBeDefined();
        expect(result.length).toBe(1);
        expect(result[0].timeslots.length).toBeGreaterThan(0);
      });

      it('is_ignore_schedule가 false이고 is_ignore_workhour가 true일 때, 이벤트만 고려하여 슬롯을 반환', () => {
        const body: RequestBody = {
          start_day_identifier,
          timezone_identifier: timezone,
          service_duration: 3600,
          days: 1,
          timeslot_interval: 1800,
          is_ignore_schedule: false,
          is_ignore_workhour: true,
        };
        const result = getDayTimetables(body);
        expect(result).toBeDefined();
        expect(result.length).toBe(1);
        expect(result[0].timeslots.length).toBeGreaterThan(0);
      });

      it('is_ignore_schedule가 true이고 is_ignore_workhour가 true일 때, 모든 일정과 근무 시간을 무시하고 슬롯을 반환', () => {
        const body: RequestBody = {
          start_day_identifier,
          timezone_identifier: timezone,
          service_duration: 3600,
          days: 1,
          timeslot_interval: 1800,
          is_ignore_schedule: true,
          is_ignore_workhour: true,
        };
        const result = getDayTimetables(body);
        expect(result).toBeDefined();
        expect(result.length).toBe(1);
        expect(result[0].timeslots.length).toBeGreaterThan(0);
      });
    });
  });
});
