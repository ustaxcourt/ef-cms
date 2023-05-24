/**
 * parse a date
 * @param {object} options the providers object
 * @param {string} options.dateString the date string to parse
 * @param {object} options.applicationContext the application context
 * @returns {object} the parsed date
 */
export const parseDateToMonthDayYear = ({ applicationContext, dateString }) => {
  let dtDate;
  if (!dateString) {
    dtDate = null;
  } else {
    dtDate = applicationContext
      .getUtilities()
      .prepareDateFromString(dateString);
  }

  const result =
    applicationContext.getUtilities().deconstructDate(dtDate) || {};

  return result;
};
