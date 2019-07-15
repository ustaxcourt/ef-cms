/**
 * parse a date
 *
 * @param {object} options the providers object
 * @param {string} options.dateString the date string to parse
 * @param {object} options.applicationContext the application context
 * @returns {object} the parsed date
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
