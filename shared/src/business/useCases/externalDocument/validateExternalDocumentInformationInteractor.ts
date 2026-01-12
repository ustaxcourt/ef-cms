import { ExternalDocumentInformationFactory } from '../../entities/externalDocument/ExternalDocumentInformationFactory';

/**
 * validateExternalDocumentInformationInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.documentMetadata the document metadata
 * @param {string} providers.currentUserId the current user ID
 * @returns {object} errors (null if no errors)
 */
export const validateExternalDocumentInformationInteractor = ({
  documentMetadata,
  currentUser,
}: {
  documentMetadata: any;
  currentUser: { userId: string; role: string };
}) => {
  const externalDocument = new ExternalDocumentInformationFactory({
    ...documentMetadata,
    currentUser,
  });

  return externalDocument.getFormattedValidationErrors();
};
