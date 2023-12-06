import { get } from './requests';

/**
 * getPractitionerDocumentDownloadUrlInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number for the case containing the document
 * @param {string} providers.key the key of the document to retrieve
 * @param {boolean} providers.isPublic whether the url is for the public site or not
 * @returns {Promise<*>} the promise of the api call
 */
export const getPractitionerDocumentDownloadUrlInteractor = (
  applicationContext,
  { barNumber, practitionerDocumentFileId },
) => {
  return get({
    applicationContext,
    endpoint: `/practitioner-documents/${barNumber}/${practitionerDocumentFileId}/document-download-url`,
  });
};
