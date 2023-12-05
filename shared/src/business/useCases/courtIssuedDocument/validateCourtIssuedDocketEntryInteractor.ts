import { CourtIssuedDocumentFactory } from '../../entities/courtIssuedDocument/CourtIssuedDocumentFactory';

export const validateCourtIssuedDocketEntryInteractor = ({ entryMetadata }) => {
  return CourtIssuedDocumentFactory(
    entryMetadata,
  ).getFormattedValidationErrors();
};
