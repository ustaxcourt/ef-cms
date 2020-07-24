const { post } = require('../requests');

/**
 * fileExternalDocumentProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array<string>} providers.documentIds the document ids for the primary, supporting,
 * secondary, and secondary supporting documents
 * @param {object} providers.documentMetadata the metadata for all the documents
 * @returns {Promise<*>} the promise of the api call
 */
exports.fileExternalDocumentInteractor = ({
  applicationContext,
  documentIds,
  documentMetadata,
}) => {
  const { docketNumber } = documentMetadata;
  return post({
    applicationContext,
    body: {
      documentIds,
      documentMetadata,
    },
    endpoint: `/case-documents/${docketNumber}/external-document`,
  });
};
