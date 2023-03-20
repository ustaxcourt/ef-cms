const { get } = require('../requests');

/**
 * getPublicJudgesProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @returns {Promise<*>} the promise of the api call
 */
exports.getPublicJudgesInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/public-api/judges',
  });
};
