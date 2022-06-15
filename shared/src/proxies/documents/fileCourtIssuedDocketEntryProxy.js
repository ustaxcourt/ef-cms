const { post } = require('../requests');

/**
 * fileCourtIssuedDocketEntryProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentMeta the document data
 * @returns {Promise<*>} the promise of the api call
 */
exports.fileCourtIssuedDocketEntryInteractor = (
  applicationContext,
  { documentMeta },
) => {
  const { docketNumbers } = documentMeta;
  const subjectDocketNumber = docketNumbers[0];
  return post({
    applicationContext,
    body: {
      documentMeta,
    },
    endpoint: `/case-documents/${subjectDocketNumber}/court-issued-docket-entry`,
  });
};
