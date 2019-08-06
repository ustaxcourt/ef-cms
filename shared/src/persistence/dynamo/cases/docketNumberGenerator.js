/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {string} the generated docket number
 */
exports.createDocketNumber = async ({ applicationContext }) => {
  const id = await applicationContext.getPersistenceGateway().incrementCounter({
    applicationContext,
    key: 'docketNumberCounter',
  });
  const plus100 = id + 100;
  const last2YearDigits = new Date()
    .getFullYear()
    .toString()
    .substr(-2);
  return `${plus100}-${last2YearDigits}`;
};
