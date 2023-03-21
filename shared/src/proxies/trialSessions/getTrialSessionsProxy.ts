const { get } = require('../requests');

/**
 * getTrialSessionsInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getTrialSessionsInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/trial-sessions',
  });
};
