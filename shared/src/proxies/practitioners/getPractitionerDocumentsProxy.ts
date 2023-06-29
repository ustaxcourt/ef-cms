import { get } from '../requests';

/**
 * getPractitionerDocumentsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.barNumber the bar number
 * @returns {Promise<object>} the document data
 */
export const getPractitionerDocumentsInteractor = (
  applicationContext,
  { barNumber },
) => {
  return get({
    applicationContext,
    endpoint: `/practitioners/${barNumber}/documents`,
  });
};
