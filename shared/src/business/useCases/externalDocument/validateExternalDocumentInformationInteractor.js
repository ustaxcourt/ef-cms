const {
  ExternalDocumentInformationFactory,
} = require('../../entities/externalDocument/ExternalDocumentInformationFactory');

/**
 * validateExternalDocumentInformationInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentMetadata the document metadata
 * @returns {object} errors (null if no errors)
 */
exports.validateExternalDocumentInformationInteractor = (
  applicationContext,
  { documentMetadata },
) => {
  const externalDocument = ExternalDocumentInformationFactory.get(
    documentMetadata,
    { applicationContext },
  );

  return externalDocument.getFormattedValidationErrors();
};
