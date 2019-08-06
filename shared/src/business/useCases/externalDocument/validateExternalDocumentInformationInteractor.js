/**
 * validateExternalDocumentInformationInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the document metadata
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
