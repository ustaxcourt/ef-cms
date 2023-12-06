import { ExternalDocumentInformationFactory } from '../../entities/externalDocument/ExternalDocumentInformationFactory';

/**
 * validateExternalDocumentInformationInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.documentMetadata the document metadata
 * @returns {object} errors (null if no errors)
 */
export const validateExternalDocumentInformationInteractor = ({
  documentMetadata,
}) => {
  const externalDocument = new ExternalDocumentInformationFactory(
    documentMetadata,
  );

  return externalDocument.getFormattedValidationErrors();
};
