import { DayTimetable, Timeslot } from '../models/dayTimetable';
import { convertToTimeZone } from '../utils/timeUtils';
import { validateRequestBody } from '../utils/validation';
import { RequestBody } from '../interfaces/requestBody';
import dayjs from 'dayjs';
import events from '../data/events.json';
import workhours from '../data/workhours.json';

export const generateAvailableTimeSlots = (dayUnix: number, serviceDuration: number, timeslotInterval: number): Timeslot[] => {
        const slots: Timeslot[] = [];
        const totalDurationInSeconds = 24 * 60 * 60;
    
        for (let time = dayUnix; time < dayUnix + totalDurationInSeconds; time += timeslotInterval) {
            const slotBegin = time;
            const slotEnd = time + serviceDuration;

            if (slotEnd < dayUnix + totalDurationInSeconds) {
                slots.push({
                    begin_at: slotBegin,
                    end_at: slotEnd,
                });
            }
        }
    
        return slots;
    };
    

export const doesOverlap = (slot: Timeslot, event: { begin_at: number; end_at: number }): boolean => {
    const slotBegin = slot.begin_at;
    const slotEnd = slot.end_at;
    return slotBegin < event.end_at && slotEnd > event.begin_at;
};

const filterTimeslots = (timeslots: Timeslot[], body: RequestBody, startOfDayUnix: number): Timeslot[] => {
    const weekday = dayjs.unix(startOfDayUnix).format('ddd').toLowerCase();

    if (!body.is_ignore_schedule) {
        timeslots = timeslots.filter(slot =>
            !events.some(event => doesOverlap(slot, event))
        );
    }

    const doesWorkhourOverlap = (slot: Timeslot, workhour: { open_interval: number; close_interval: number }, startOfDayUnix: number): boolean => {
        const slotBegin = slot.begin_at;
        const slotEnd = slot.end_at;
    
        const workhourBegin = startOfDayUnix + workhour.open_interval;
        const workhourEnd = startOfDayUnix + workhour.close_interval;

        return slotBegin < workhourEnd && slotEnd > workhourBegin;
    };

    if (!body.is_ignore_workhour) {
        timeslots = timeslots.filter(slot =>
            !workhours.some(workhour => {
                const isDayOff = workhour.is_day_off;
                const isMatchingDay = workhour.key === weekday;
                const overlapping = isMatchingDay && doesWorkhourOverlap(slot, workhour, startOfDayUnix);
    
                return isDayOff || overlapping;
            })
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
    const startOfDayUnix = dayjs.utc(start_day_identifier, 'YYYYMMDD').startOf('day').unix();

    for (let i = 0; i < days; i++) {
        const currentDayUnix = startOfDayUnix + i * 86400;
        const currentDay = convertToTimeZone(currentDayUnix, timezone_identifier);

        const availableSlots = generateAvailableTimeSlots(currentDayUnix, service_duration, timeslot_interval);

        const timeslots: Timeslot[] = availableSlots.map(slot => ({
            begin_at: slot.begin_at,
            end_at: slot.end_at,
        }));

        const filteredTimeslots = filterTimeslots(timeslots, body, startOfDayUnix);

        const workhourData = workhours.find(workhour => workhour.key === dayjs.unix(currentDayUnix).format('ddd').toLowerCase());
        const isDayOff = workhourData ? workhourData.is_day_off : false;

        timetables.push({
            start_of_day: currentDay,
            day_modifier: i,
            is_day_off: isDayOff,
            timeslots: filteredTimeslots,
        });
    }

    return timetables;
};