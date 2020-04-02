const querystring = require('querystring');
const { get } = require('../requests');

/**
 * getPractitionersBySearchKeyProxy
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.barNumber the bar number to search by
 * @param {string} params.name the name to search by
 * @returns {Promise<*>} the promise of the api call
 */
exports.getPractitionersBySearchKeyInteractor = ({
  applicationContext,
  barNumber,
  name,
}) => {
  const queryString = querystring.stringify({ barNumber, name });

  return get({
    applicationContext,
    endpoint: `/practitioners?${queryString}`,
  });
};
