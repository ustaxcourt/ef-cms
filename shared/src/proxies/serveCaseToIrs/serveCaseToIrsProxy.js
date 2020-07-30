const { post } = require('../requests');

/**
 * serveCaseToIrsInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber docket number for serving a case
 * @returns {Promise<*>} the promise of the api call
 */
exports.serveCaseToIrsInteractor = ({ applicationContext, docketNumber }) => {
  return post({
    applicationContext,
    endpoint: `/cases/${docketNumber}/serve-to-irs`,
  });
};
