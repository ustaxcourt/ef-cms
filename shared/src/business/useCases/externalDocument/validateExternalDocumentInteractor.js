/**
 * validateExternalDocument
 * @param applicationContext
 * @param documentMetadata
 * @returns {Object} errors (null if no errors)
 */
exports.validateExternalDocument = ({
  applicationContext,
  documentMetadata,
}) => {
  const externalDocument = applicationContext
    .getEntityConstructors()
    .ExternalDocumentFactory.get(documentMetadata);

  return externalDocument.getFormattedValidationErrors();
};
