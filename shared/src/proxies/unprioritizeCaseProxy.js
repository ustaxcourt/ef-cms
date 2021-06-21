const { remove } = require('./requests');

/**
 * unprioritizeCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @returns {Promise<*>} the promise of the api call
 */
exports.unprioritizeCaseInteractor = (applicationContext, { docketNumber }) => {
  return remove({
    applicationContext,
    body: {},
    endpoint: `/case-meta/${docketNumber}/high-priority`,
  });
};
