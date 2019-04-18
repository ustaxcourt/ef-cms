/**
 * validateExternalDocumentInformation
 * @param applicationContext
 * @param documentMetadata
 * @returns {Object} errors (null if no errors)
 */
exports.validateExternalDocumentInformation = ({
  applicationContext,
  documentMetadata,
}) => {
  const externalDocument = applicationContext
    .getEntityConstructors()
    .ExternalDocumentInformationFactory.get(documentMetadata);

  return externalDocument.getFormattedValidationErrors();
};
