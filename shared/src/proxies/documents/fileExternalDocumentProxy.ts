import { post } from '../requests';

/**
 * fileExternalDocumentProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the metadata for all the documents
 * @returns {Promise<*>} the promise of the api call
 */
export const fileExternalDocumentInteractor = (
  applicationContext,
  { documentMetadata },
) => {
  const { docketNumber } = documentMetadata;
  return post({
    applicationContext,
    body: {
      documentMetadata,
    },
    endpoint: `/case-documents/${docketNumber}/external-document`,
  });
};
