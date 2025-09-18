import fedHolidays from '@18f/us-federal-holidays';
import { isStringISOFormatted } from './DateHandler';

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
  // const start = calculateDate({
  //   dateString: startDate,
  // });

  // const end = calculateDate({
  //   dateString: endDate,
  // });
  // const start = calculateDateAtStartOfDayEST({ dateString: startDate });
  // const end = calculateDateAtStartOfDayEST({ dateString: endDate });

  const start = new Date(startDate);
  const end = new Date(endDate);

  console.log('start', start);
  console.log('end', end);
  return fedHolidays.inRange(start, end, options);
};
