import fedHolidays from '@18f/us-federal-holidays';
import {
  calculateDate,
  createEndOfDayISOUtc,
  createStartOfDayISOUtc,
} from './DateHandler';

// expects input dates to be in YYYY-MM-DD format
export const getHolidaysInDateRange = (
  startDate: string,
  endDate: string,
  options = { shiftSaturdayHolidays: false, shiftSundayHolidays: false },
) => {
  const start = calculateDate({
    dateString: createStartOfDayISOUtc(startDate),
  });

  const end = calculateDate({
    dateString: createEndOfDayISOUtc(endDate),
  });

  return fedHolidays.inRange(start, end, options);
};
