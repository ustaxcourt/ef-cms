/**
 * returns a formatted scan mode label based on the scanMode value
 * @param {object} applicationContext the application context
 * @param {string} dateToFormat date as a string
 * @returns {string} ISO Date formatted as a string
 */
export const preparedDateToISOString = (applicationContext, dateToFormat) => {
  if (!dateToFormat) {
    return null;
  }

  return applicationContext
    .getUtilities()
    .prepareDateFromString(dateToFormat)
    .toISO();
};
