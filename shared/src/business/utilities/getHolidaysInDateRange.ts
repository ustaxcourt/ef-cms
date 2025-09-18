import fedHolidays from '@18f/us-federal-holidays';
import { calculateDate, isStringISOFormatted } from './DateHandler';

export const getHolidaysInDateRange = (
  startDate: string,
  endDate: string,
  options = { shiftSaturdayHolidays: false, shiftSundayHolidays: false },
) => {
  console.log('getHolidaysInDateRange termStartDate', startDate);
  console.log('getHolidaysInDateRange termEndDate', endDate);

  if (!isStringISOFormatted(startDate) || !isStringISOFormatted(endDate)) {
    throw new Error('start date or end date are not ISO dates');
  }
  const start = calculateDate({
    dateString: startDate,
  });

  const end = calculateDate({
    dateString: endDate,
  });

  console.log('start', start);
  console.log('end', end);
  return fedHolidays.inRange(start, end, options);
};
