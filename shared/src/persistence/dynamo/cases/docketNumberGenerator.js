/**
 * createDocketNumber
 *
 * creates a docket number by incrementing the value
 * in the datastore
 *
 * @returns {Promise.<string>}
 */
exports.createDocketNumber = async ({ applicationContext }) => {
  const id = await applicationContext.getPersistenceGateway().incrementCounter({
    applicationContext,
  });
  const plus100 = id + 100;
  const last2YearDigits = new Date()
    .getFullYear()
    .toString()
    .substr(-2);
  return `${plus100}-${last2YearDigits}`;
};
