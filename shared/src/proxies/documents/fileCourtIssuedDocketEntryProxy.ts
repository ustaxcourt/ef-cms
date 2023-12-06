import { post } from '../requests';

/**
 * fileCourtIssuedDocketEntryProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentMeta the document data
 * @returns {Promise<*>} the promise of the api call
 */
export const fileCourtIssuedDocketEntryInteractor = (
  applicationContext,
  { docketNumbers, documentMeta, subjectDocketNumber },
) => {
  return post({
    applicationContext,
    body: {
      docketNumbers,
      documentMeta,
      subjectDocketNumber,
    },
    endpoint: `/case-documents/${subjectDocketNumber}/court-issued-docket-entry`,
  });
};
