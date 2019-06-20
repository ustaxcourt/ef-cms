/**
 * validateExternalDocument
 * @param applicationContext
 * @param documentMetadata
 * @returns {object} errors (null if no errors)
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
