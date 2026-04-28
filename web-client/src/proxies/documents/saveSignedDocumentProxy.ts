import { post } from '../requests';

/**
 * saveSignedDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case on which to save the document
 * @param {string} providers.originalDocketEntryId the id of the original (unsigned) document
 * @param {string} providers.signedDocketEntryId the id of the signed document
 * @param {string} providers.nameForSigning name
 * @returns {Promise<*>} the promise of the api call
 */
export const saveSignedDocumentInteractor = (
  applicationContext,
  {
    docketNumber,
    nameForSigning,
    originalDocketEntryId,
    parentMessageId,
    signedDocumentStorageId,
  },
) => {
  return post({
    applicationContext,
    body: {
      nameForSigning,
      parentMessageId,
      signedDocumentStorageId,
    },
    endpoint: `/case-documents/${docketNumber}/${originalDocketEntryId}/sign`,
  });
};
