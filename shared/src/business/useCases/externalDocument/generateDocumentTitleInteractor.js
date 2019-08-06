/**
 * generateDocumentTitleInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the document metadata
 * @returns {string} document title
 */
exports.generateDocumentTitleInteractor = ({
  applicationContext,
  documentMetadata,
}) => {
  const externalDocument = applicationContext
    .getEntityConstructors()
    .ExternalDocumentFactory.get(documentMetadata);
  return externalDocument.getDocumentTitle();
};
