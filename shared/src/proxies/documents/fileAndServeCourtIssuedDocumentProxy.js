const { post } = require('../requests');

/**
 * fileAndServeCourtIssuedDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.data the data being forwarded to the API call
 * @returns {Promise<*>} the promise of the API call
 */
exports.fileAndServeCourtIssuedDocumentInteractor = (
  applicationContext,
  data,
) => {
  const { subjectCaseDocketNumber } = data;
  return post({
    applicationContext,
    body: data,
    endpoint: `/async/case-documents/${subjectCaseDocketNumber}/file-and-serve-court-issued-docket-entry`,
  });
};
