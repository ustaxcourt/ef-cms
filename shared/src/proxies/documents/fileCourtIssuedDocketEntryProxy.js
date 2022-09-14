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
  { docketNumbers, documentMeta },
) => {
  const subjectDocketNumber = docketNumbers[0];
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
