/**
 * validateExternalDocumentInteractor
 * @param applicationContext
 * @param documentMetadata
 * @returns {object} errors (null if no errors)
 */
exports.validateExternalDocumentInteractor = ({
  applicationContext,
  documentMetadata,
}) => {
  const externalDocument = applicationContext
    .getEntityConstructors()
    .ExternalDocumentFactory.get(documentMetadata);

  return externalDocument.getFormattedValidationErrors();
};
