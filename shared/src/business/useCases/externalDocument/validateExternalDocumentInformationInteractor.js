const {
  ExternalDocumentInformationFactory,
} = require('../../entities/externalDocument/ExternalDocumentInformationFactory');

/**
 * validateExternalDocumentInformationInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.documentMetadata the document metadata
 * @returns {object} errors (null if no errors)
 */
exports.validateExternalDocumentInformationInteractor = ({
  documentMetadata,
}) => {
  const externalDocument = ExternalDocumentInformationFactory(documentMetadata);

  return externalDocument.getFormattedValidationErrors();
};
