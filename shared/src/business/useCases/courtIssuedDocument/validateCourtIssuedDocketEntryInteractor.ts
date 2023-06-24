import { CourtIssuedDocumentFactory } from '../../entities/courtIssuedDocument/CourtIssuedDocumentFactory';

export const validateCourtIssuedDocketEntryInteractor = ({ entryMetadata }) => {
  const courtIssuedDocument = CourtIssuedDocumentFactory(entryMetadata);

  return courtIssuedDocument.getFormattedValidationErrors();
};
