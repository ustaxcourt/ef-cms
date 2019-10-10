const { get } = require('../requests');

/**
 * getAllCaseDeadlinesInteractorProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getAllCaseDeadlinesInteractor = ({ applicationContext }) => {
  return get({
    applicationContext,
    endpoint: '/case-deadlines',
  });
};
