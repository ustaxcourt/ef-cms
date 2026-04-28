import { post } from '../requests';

/**
 * createPractitionerDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.user the user data
 * @returns {Promise<object>} the created user data
 */
export const createPractitionerDocumentInteractor = (
  applicationContext,
  { barNumber, documentMetadata },
) => {
  return post({
    applicationContext,
    body: documentMetadata,
    endpoint: `/practitioners/${barNumber}/documents`,
  });
};
