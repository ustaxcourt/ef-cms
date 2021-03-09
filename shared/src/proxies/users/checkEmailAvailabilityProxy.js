const querystring = require('querystring');
const { get } = require('../requests');

/**
 * checkEmailAvailabilityInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.email the email to check
 * @returns {Promise<*>} the promise of the api call
 */
exports.checkEmailAvailabilityInteractor = ({ applicationContext, email }) => {
  const queryString = querystring.stringify({
    email,
  });

  return get({
    applicationContext,
    endpoint: `/users/email-availability?${queryString}`,
  });
};
