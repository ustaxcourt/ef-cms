const { get } = require('../requests');

/**
 * getHealthCheckInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getHealthCheckInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/public-api/health',
  });
};
