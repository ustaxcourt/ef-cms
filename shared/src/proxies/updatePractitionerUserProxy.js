const { put } = require('./requests');

/**
 * updatePractitionerUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.user the user data
 * @returns {Promise<object>} the updated user data
 */
exports.updatePractitionerUserInteractor = ({ applicationContext, user }) => {
  return put({
    applicationContext,
    body: { user },
    endpoint: '/users/practitioner',
  });
};
