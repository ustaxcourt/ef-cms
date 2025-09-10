import fedHolidays from '@18f/us-federal-holidays';

export const getHolidaysInDateRange = (startDate, endDate) => {
  const options = { shiftSaturdayHolidays: false, shiftSundayHolidays: false };
  const start = startDate ? new Date(startDate) : new Date();
  const end = endDate ? new Date(endDate) : new Date();
  return fedHolidays.inRange(start, end, options);
};
