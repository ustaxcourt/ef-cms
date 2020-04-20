const { get } = require('../requests');

/**
 * getPractitionerByBarNumberInteractor
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.barNumber the bar number for the practitioner to fetch
 * @returns {Promise<*>} the promise of the api call
 */
exports.getPractitionerByBarNumberInteractor = ({
  applicationContext,
  barNumber,
}) => {
  return get({
    applicationContext,
    endpoint: `/practitioners/${barNumber}`,
  });
};
