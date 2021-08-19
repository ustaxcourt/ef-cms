const querystring = require('querystring');
const { get } = require('../requests');

/**
 * getPractitionersByNameProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} params the params object
 * @param {string} params.name the name to search by
 * @returns {Promise<*>} the promise of the api call
 */
exports.getPractitionersByNameInteractor = (applicationContext, { name }) => {
  const queryString = querystring.stringify({ name });

  return get({
    applicationContext,
    endpoint: `/practitioners?${queryString}`,
  });
};
