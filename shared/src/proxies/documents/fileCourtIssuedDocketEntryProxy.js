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
  const { docketNumber } = documentMeta;
  return post({
    applicationContext,
    body: {
      documentMeta,
    },
    endpoint: `/case-documents/${docketNumber}/court-issued-docket-entry`,
  });
};
