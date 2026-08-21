import { ExternalDocumentFactory } from '@web-client/business/entities/externalDocument/ExternalDocumentFactory';

/**
 * validateExternalDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.documentMetadata the document metadata
 * @returns {object} errors (null if no errors)
 */
export const validateExternalDocumentInteractor = ({ documentMetadata }) => {
  const externalDocument = ExternalDocumentFactory(documentMetadata);

  return externalDocument.getFormattedValidationErrors();
};
