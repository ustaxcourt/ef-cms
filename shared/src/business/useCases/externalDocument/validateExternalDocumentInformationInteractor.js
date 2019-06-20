/**
 * validateExternalDocumentInformation
 * @param applicationContext
 * @param documentMetadata
 * @returns {object} errors (null if no errors)
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
