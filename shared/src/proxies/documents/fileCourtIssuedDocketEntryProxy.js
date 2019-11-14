const { post } = require('../requests');

/**
 * fileCourtIssuedDocketEntryProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMeta the document data
 * @returns {Promise<*>} the promise of the api call
 */
exports.fileCourtIssuedDocketEntryInteractor = ({
  applicationContext,
  documentMeta,
}) => {
  const { caseId } = documentMeta;
  return post({
    applicationContext,
    body: {
      documentMeta,
    },
    endpoint: `/case-documents/${caseId}/court-issued-docket-entry`,
  });
};
