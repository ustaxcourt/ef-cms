const { put } = require('./requests');

/**
 * updateAttorneyUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.user the user data
 * @returns {Promise<object>} the updated user data
 */
exports.updateAttorneyUserInteractor = ({ applicationContext, user }) => {
  return put({
    applicationContext,
    body: { user },
    endpoint: '/users/attorney',
  });
};
