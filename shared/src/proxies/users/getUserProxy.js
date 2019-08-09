const { get } = require('../requests');

/**
 * getUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getUserInteractor = ({ applicationContext }) => {
  return get({
    applicationContext,
    endpoint: '/users',
  });
};
