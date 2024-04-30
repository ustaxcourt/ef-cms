import { asyncSyncHandler, post } from '../requests';

/**
 * fileCourtIssuedOrderProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the document metadata
 * @param {string} providers.primaryDocumentFileId the id of the primary document
 * @returns {Promise<*>} the promise of the api call
 */
export const fileCourtIssuedOrderInteractor = (
  applicationContext,
  { documentMetadata, primaryDocumentFileId },
) => {
  const { docketNumber } = documentMetadata;
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await post({
        applicationContext,
        asyncSyncId,
        body: {
          documentMetadata,
          primaryDocumentFileId,
        },
        endpoint: `/async/case-documents/${docketNumber}/court-issued-order`,
      }),
  );
};
