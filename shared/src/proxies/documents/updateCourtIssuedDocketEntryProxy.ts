const { put } = require('../requests');

/**
 * updateCourtIssuedDocketEntryProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentMeta the document data
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateCourtIssuedDocketEntryInteractor = (
  applicationContext,
  { documentMeta },
) => {
  const { docketNumber } = documentMeta;
  return put({
    applicationContext,
    body: {
      documentMeta,
    },
    endpoint: `/case-documents/${docketNumber}/court-issued-docket-entry`,
  });
};
