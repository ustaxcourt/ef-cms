const querystring = require('querystring');
const { get } = require('../requests');

/**
 * checkEmailAvailabilityInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.email the email to check
 * @returns {Promise<*>} the promise of the api call
 */
exports.checkEmailAvailabilityInteractor = (applicationContext, { email }) => {
  const queryString = querystring.stringify({
    email,
  });

  return get({
    applicationContext,
    endpoint: `/users/email-availability?${queryString}`,
  });
};
