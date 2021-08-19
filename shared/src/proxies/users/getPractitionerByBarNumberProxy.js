const { get } = require('../requests');

/**
 * getPractitionerByBarNumberInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.barNumber the bar number for the practitioner to fetch
 * @returns {Promise<*>} the promise of the api call
 */
exports.getPractitionerByBarNumberInteractor = (
  applicationContext,
  { barNumber },
) => {
  return get({
    applicationContext,
    endpoint: `/practitioners/${barNumber}`,
  });
};
