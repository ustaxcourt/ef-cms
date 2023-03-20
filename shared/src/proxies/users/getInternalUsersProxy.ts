const { get } = require('../requests');

/**
 * getInternalUsersInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getInternalUsersInteractor = ({ applicationContext }) => {
  return get({
    applicationContext,
    endpoint: '/users/internal',
  });
};
