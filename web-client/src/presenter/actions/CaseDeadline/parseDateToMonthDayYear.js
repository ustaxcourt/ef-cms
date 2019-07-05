/**
 * parse a date
 *
 * @param {string} dateString the date string to parse
 * @param {object} applicationContext the application context
 * @returns {object}
 */
export const parseDateToMonthDayYear = ({ applicationContext, dateString }) => {
  const momentedDate = applicationContext
    .getUtilities()
    .prepareDateFromString(dateString);
  let month;
  let day;
  let year;

  if (
    momentedDate &&
    momentedDate.toDate() instanceof Date &&
    !isNaN(momentedDate.toDate())
  ) {
    month = momentedDate.format('M');
    day = momentedDate.format('D');
    year = momentedDate.format('YYYY');
  }
  return {
    day,
    month,
    year,
  };
};
