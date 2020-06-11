const { get } = require('../requests');

// eslint-disable-next-line spellcheck/spell-checker
/**
 * getTodaysOpinionsProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getTodaysOpinionsInteractor = ({ applicationContext }) => {
  return get({
    applicationContext,
    endpoint: '/public-api/todays-opinion',
  });
};
