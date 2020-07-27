const { put } = require('../requests');

/**
 * updateCourtIssuedOrderProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the document metadata
 * @param {string} providers.primaryDocumentFileId the id of the primary document
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateCourtIssuedOrderInteractor = ({
  applicationContext,
  documentIdToEdit,
  documentMetadata,
}) => {
  const { docketNumber } = documentMetadata;
  return put({
    applicationContext,
    body: {
      documentMetadata,
    },
    endpoint: `/case-documents/${docketNumber}/court-issued-orders/${documentIdToEdit}`,
  });
};
