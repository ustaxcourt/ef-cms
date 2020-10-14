const {
  formatDateString,
  FORMATS,
} = require('../../../business/utilities/DateHandler');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {string} the generated docket number
 */
exports.createDocketNumber = async ({ applicationContext, receivedAt }) => {
  let year;
  if (receivedAt) {
    year = formatDateString(receivedAt, FORMATS.YEAR);
  } else {
    year = new Date().getFullYear().toString();
  }

  const id = await applicationContext.getPersistenceGateway().incrementCounter({
    applicationContext,
    key: 'docketNumberCounter',
    year,
  });
  const plus100 = id + 100;
  const lastTwo = year.slice(-2);
  return `${plus100}-${lastTwo}`;
};
