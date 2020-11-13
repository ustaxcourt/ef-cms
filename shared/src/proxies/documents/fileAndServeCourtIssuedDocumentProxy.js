const { post } = require('../requests');

/**
 * fileAndServeCourtIssuedDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.documentMeta the document metadata
 * @returns {Promise<*>} the promise of the api call
 */
exports.fileAndServeCourtIssuedDocumentInteractor = ({
  applicationContext,
  documentMeta,
}) => {
  const { docketNumber } = documentMeta;
  return post({
    applicationContext,
    body: {
      documentMeta,
    },
    endpoint: `/case-documents/${docketNumber}/file-and-serve-court-issued-docket-entry`,
  });
};
