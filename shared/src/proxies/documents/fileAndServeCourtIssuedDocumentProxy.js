const { post } = require('../requests');

/**
 * fileAndServeCourtIssuedDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.documentMeta the document metadata
 * @returns {Promise<*>} the promise of the api call
 */
exports.fileAndServeCourtIssuedDocumentInteractor = (
  applicationContext,
  documentMeta,
) => {
  const { subjectCaseDocketNumber } = documentMeta;
  return post({
    applicationContext,
    body: {
      ...documentMeta,
    },
    endpoint: `/case-documents/${subjectCaseDocketNumber}/file-and-serve-court-issued-docket-entry`,
  });
};
