const { put } = require('../requests');

/**
 * updateCourtIssuedDocketEntryProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.document the document data
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateCourtIssuedDocketEntryInteractor = ({
  applicationContext,
  documentMeta,
}) => {
  const { caseId } = documentMeta;
  return put({
    applicationContext,
    body: {
      documentMeta,
    },
    endpoint: `/case-documents/${caseId}/court-issued-docket-entry`,
  });
};
