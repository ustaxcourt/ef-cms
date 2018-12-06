/**
 * createDocketNumber
 *
 * creates a docket number by incrementing the value
 * in the datastore
 *
 * @returns {Promise.<string>}
 */
exports.createDocketNumber = async ({ applicationContext }) => {
  const id = await applicationContext.persistence.incrementCounter({
    applicationContext,
  });
  const plus100 = id + 100;
  const last2YearDigits = new Date()
    .getFullYear()
    .toString()
    .substr(-2);
  const pad = `00000${plus100}`.substr(-5);
  return `${pad}-${last2YearDigits}`;
};
