/**
 * validateExternalDocumentInformationInteractor
 * @param applicationContext
 * @param documentMetadata
 * @returns {object} errors (null if no errors)
 */
exports.validateExternalDocumentInformationInteractor = ({
  applicationContext,
  documentMetadata,
}) => {
  const externalDocument = applicationContext
    .getEntityConstructors()
    .ExternalDocumentInformationFactory.get(documentMetadata);

  return externalDocument.getFormattedValidationErrors();
};
