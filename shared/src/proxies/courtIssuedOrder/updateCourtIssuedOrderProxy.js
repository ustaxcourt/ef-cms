const { put } = require('../requests');

/**
 * updateCourtIssuedOrderProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentMetadata the document metadata
 * @param {string} providers.docketEntryIdToEdit the id of the docket entry to edit
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateCourtIssuedOrderInteractor = (
  applicationContext,
  { docketEntryIdToEdit, documentMetadata },
) => {
  const { docketNumber } = documentMetadata;
  return put({
    applicationContext,
    body: {
      documentMetadata,
    },
    endpoint: `/case-documents/${docketNumber}/court-issued-orders/${docketEntryIdToEdit}`,
  });
};
