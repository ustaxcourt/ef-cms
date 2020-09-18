const { post } = require('../requests');

/**
 * saveSignedDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case on which to save the document
 * @param {string} providers.originalDocketEntryId the id of the original (unsigned) document
 * @param {string} providers.signedDocketEntryId the id of the signed document
 * @param {string} providers.nameForSigning name
 * @returns {Promise<*>} the promise of the api call
 */
exports.saveSignedDocumentInteractor = ({
  applicationContext,
  docketNumber,
  nameForSigning,
  originalDocketEntryId,
  parentMessageId,
  signedDocketEntryId,
}) => {
  return post({
    applicationContext,
    body: {
      nameForSigning,
      parentMessageId,
      signedDocketEntryId,
    },
    endpoint: `/case-documents/${docketNumber}/${originalDocketEntryId}/sign`,
  });
};
