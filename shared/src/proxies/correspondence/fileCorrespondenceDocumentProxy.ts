import { post } from '../requests';

/**
 * fileCorrespondenceDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentMetadata the document metadata
 * @param {string} providers.primaryDocumentFileId the id of the correspondence document
 * @returns {Promise<*>} the promise of the api call
 */
export const fileCorrespondenceDocumentInteractor = (
  applicationContext,
  { documentMetadata, primaryDocumentFileId },
) => {
  const { docketNumber } = documentMetadata;
  return post({
    applicationContext,
    body: {
      documentMetadata,
      primaryDocumentFileId,
    },
    endpoint: `/case-documents/${docketNumber}/correspondence`,
  });
};
