import { get } from './requests';

/**
 * getPractitionerDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.practitionerDocumentFileId the key of the document
 * @param {string} providers.barNumber the bar number of the practitioner
 * @returns {Promise<*>} the promise of the api call
 */
export const getPractitionerDocumentInteractor = (
  applicationContext,
  { barNumber, practitionerDocumentFileId },
) => {
  return get({
    applicationContext,
    endpoint: `/practitioner-documents/${barNumber}/${practitionerDocumentFileId}`,
  });
};
