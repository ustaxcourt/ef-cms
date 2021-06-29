const { put } = require('../requests');

/**
 * updatePractitionerUserInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.barNumber the barNumber of the user to update
 * @param {object} providers.user the user data
 * @returns {Promise<object>} the updated user data
 */
exports.updatePractitionerUserInteractor = (
  applicationContext,
  { barNumber, user },
) => {
  return put({
    applicationContext,
    body: { user },
    endpoint: `/async/practitioners/${barNumber}`,
  });
};
