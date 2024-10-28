import { getDayTimetables } from '../src/services/timetableService';
import { RequestBody } from '../src/interfaces/requestBody';
import events from '../src/data/events.json';
import workhours from '../src/data/workhours.json';
import dayjs from 'dayjs';

jest.mock('../src/data/events.json', () => [
    {
        "begin_at": 1620268200,
        "end_at": 1620275400,
    },
    {
        "begin_at": 1620275400,
        "end_at": 1620275400,
    },
]);

jest.mock('../src/data/workhours.json', () => [
    {
        "close_interval": 72000,
        "is_day_off": false,
        "key": "fri",
        "open_interval": 36000,
    },
    {
        "close_interval": 46800,
        "is_day_off": true,
        "key": "mon",
        "open_interval": 43200,
    },
]);

describe('getDayTimetables', () => {
    const baseRequestBody: RequestBody = {
        start_day_identifier: '20210509',
        timezone_identifier: 'Asia/Seoul',
        service_duration: 3600,
        days: 3,
        timeslot_interval: 1800,
        is_ignore_schedule: false,
        is_ignore_workhour: false,
    };

    // Step 1: DayTimetable 반환 테스트
    it('start_day_identifier가 20210509일 때 올바른 DayTimetable을 반환해야 합니다', () => {
        const requestBody = { ...baseRequestBody };
        const timetables = getDayTimetables(requestBody);

        expect(timetables).toBeDefined();
        expect(timetables.length).toBe(3);
        expect(timetables[0].start_of_day).toBe(dayjs.utc('20210509').startOf('day').unix());
        expect(timetables[1].start_of_day).toBe(dayjs.utc('20210510').startOf('day').unix());
        expect(timetables[2].start_of_day).toBe(dayjs.utc('20210511').startOf('day').unix());
    });

    // Step 2: is_ignore_schedule: false
    it('is_ignore_schedule가 false일 때, Event 데이터와 겹치지 않는 Timeslot을 반환해야 합니다', () => {
        const requestBody = { ...baseRequestBody, is_ignore_schedule: false };
        const timetables = getDayTimetables(requestBody);

        // Timeslot이 Event와 겹치지 않도록 검증
        timetables.forEach(timetable => {
            timetable.timeslots.forEach(slot => {
                const isOverlapping = events.some(event => slot.begin_at < event.end_at && slot.end_at > event.begin_at);
                expect(isOverlapping).toBe(false);
            });
        });
    });

    // Step 2: is_ignore_schedule: true
    it('is_ignore_schedule가 true일 때, 모든 Event 데이터를 무시하고 Timeslot을 반환해야 합니다', () => {
        const requestBody = { ...baseRequestBody, is_ignore_schedule: true };
        const timetables = getDayTimetables(requestBody);

        // 모든 Timeslot이 Event와 겹치지 않음을 검증
        timetables.forEach(timetable => {
            timetable.timeslots.forEach(slot => {
                const isOverlapping = events.some(event => slot.begin_at < event.end_at && slot.end_at > event.begin_at);
                expect(isOverlapping).toBe(false);
            });
        });
    });

// Step 3: is_ignore_workhour: false
it('is_ignore_workhour가 false일 때, Workhour 데이터와 겹치지 않는 Timeslot을 반환해야 합니다', () => {
  const requestBody = { ...baseRequestBody, is_ignore_workhour: false };
  const timetables = getDayTimetables(requestBody);

  // Timeslot이 Workhour와 겹치지 않도록 검증
  timetables.forEach(timetable => {
      timetable.timeslots.forEach(slot => {
          const weekday = dayjs.unix(timetable.start_of_day).format('ddd').toLowerCase();
          const workhour = workhours.find(wh => wh.key === weekday);

          if (workhour && !workhour.is_day_off) {
              const workhourBegin = timetable.start_of_day + workhour.open_interval;
              const workhourEnd = timetable.start_of_day + workhour.close_interval;
              const isOverlapping = (slot.begin_at < workhourEnd) && (slot.end_at > workhourBegin);

              expect(isOverlapping).toBe(false);
          }
      });
  });
});


    // Step 3: is_ignore_workhour: true
    it('is_ignore_workhour가 true일 때, 모든 Workhour 데이터를 무시하고 하루 전체를 반환해야 합니다', () => {
        const requestBody = { ...baseRequestBody, is_ignore_workhour: true };
        const timetables = getDayTimetables(requestBody);

        timetables.forEach(timetable => {
            expect(timetable.timeslots.length).toBeGreaterThan(0);
            timetable.timeslots.forEach(slot => {
                expect(slot.begin_at).toBeGreaterThanOrEqual(timetable.start_of_day);
                expect(slot.end_at).toBeLessThan(timetable.start_of_day + 86400);
            });
        });
    });
});