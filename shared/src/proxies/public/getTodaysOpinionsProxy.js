const { get } = require('../requests');

/**
 * getTodaysOpinionsProxy
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getTodaysOpinionsInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/public-api/todays-opinions',
  });
};
