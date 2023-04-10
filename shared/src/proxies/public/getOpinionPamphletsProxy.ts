const { get } = require('../requests');

/**
 * getOpinionPamphletsProxy
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getOpinionPamphletsInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/public-api/opinion-pamphlets',
  });
};
