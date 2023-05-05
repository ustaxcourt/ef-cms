import { post } from './requests';

/**
 * serveCourtIssuedDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.data the data being forwarded to the API call
 * @returns {Promise<*>} the promise of the api call
 */
export const serveCourtIssuedDocumentInteractor = (
  applicationContext,
  data,
) => {
  const { docketEntryId, subjectCaseDocketNumber } = data;

  return post({
    applicationContext,
    body: data,
    endpoint: `/case-documents/${subjectCaseDocketNumber}/${docketEntryId}/serve-court-issued`,
  });
};
