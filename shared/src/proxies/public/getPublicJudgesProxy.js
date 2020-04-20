const { get } = require('../requests');

/**
 * getPublicJudgesProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getPublicJudgesInteractor = ({ applicationContext }) => {
  return get({
    applicationContext,
    endpoint: '/public-api/judges',
  });
};
