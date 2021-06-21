const {
  ExternalDocumentFactory,
} = require('../../entities/externalDocument/ExternalDocumentFactory');

/**
 * validateExternalDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentMetadata the document metadata
 * @returns {object} errors (null if no errors)
 */
exports.validateExternalDocumentInteractor = (
  applicationContext,
  { documentMetadata },
) => {
  const externalDocument = ExternalDocumentFactory.get(documentMetadata, {
    applicationContext,
  });

  return externalDocument.getFormattedValidationErrors();
};
