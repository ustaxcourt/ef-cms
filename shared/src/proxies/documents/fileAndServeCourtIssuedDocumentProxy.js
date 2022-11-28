const { post } = require('../requests');

/**
 * fileAndServeCourtIssuedDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} documentMeta the data being forwarded to the API call
 * @returns {Promise<*>} the promise of the API call
 */
exports.fileAndServeCourtIssuedDocumentInteractor = (
  applicationContext,
  documentMeta,
  clientConnectionId,
) => {
  const { subjectCaseDocketNumber } = documentMeta;
  return post({
    applicationContext,
    body: {
      clientConnectionId,
      ...documentMeta,
    },
    endpoint: `/async/case-documents/${subjectCaseDocketNumber}/file-and-serve-court-issued-docket-entry`,
  });
};
