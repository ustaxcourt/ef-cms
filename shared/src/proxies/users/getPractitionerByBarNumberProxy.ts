import { get } from '../requests';

/**
 * getPractitionerByBarNumberInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.barNumber the bar number for the practitioner to fetch
 * @returns {Promise<*>} the promise of the api call
 */
export const getPractitionerByBarNumberInteractor = (
  applicationContext,
  { barNumber },
) => {
  return get({
    applicationContext,
    endpoint: `/practitioners/${barNumber}`,
  });
};
