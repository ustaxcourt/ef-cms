import fedHolidays from '@18f/us-federal-holidays';
import { calculateDate, isStringISOFormatted } from './DateHandler';

export const getHolidaysInDateRange = (
  startDate: string,
  endDate: string,
  options = { shiftSaturdayHolidays: false, shiftSundayHolidays: false },
) => {
  if (!isStringISOFormatted(startDate) || !isStringISOFormatted(endDate)) {
    throw new Error('start date or end date are not ISO dates');
  }
  const start = calculateDate({
    dateString: startDate,
  });

  const end = calculateDate({
    dateString: endDate,
  });

  return fedHolidays.inRange(start, end, options);
};
