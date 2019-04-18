/**
 * generateDocumentTitle
 *
 * @param applicationContext
 * @param documentMetadata
 * @returns {string} document title
 */
exports.generateDocumentTitle = ({ applicationContext, documentMetadata }) => {
  const externalDocument = applicationContext
    .getEntityConstructors()
    .ExternalDocumentFactory.get(documentMetadata);

  return externalDocument.getDocumentTitle();
};
