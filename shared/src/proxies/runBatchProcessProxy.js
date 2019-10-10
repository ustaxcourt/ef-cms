const { post } = require('./requests');

/**
 * runBatchProcessInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.runBatchProcessInteractor = ({ applicationContext }) => {
  return post({
    applicationContext,
    endpoint: '/api/run-batch-process',
  });
};
