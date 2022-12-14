import { COURT_ISSUED_EVENT_CODES } from '../../entities/EntityConstants';
import { CourtIssuedDocumentFactory } from '../../entities/courtIssuedDocument/CourtIssuedDocumentFactory';

/**
 * generateCourtIssuedDocumentTitle
 *
 * @param {object} providers the providers object
 * @param {object} providers.documentMetadata the document metadata
 * @returns {string} document title
 */
export const generateCourtIssuedDocumentTitle = ({ documentMetadata }) => {
  const filingEvent = COURT_ISSUED_EVENT_CODES.find(
    item => documentMetadata.eventCode === item.eventCode,
  );

  // attempt to reset the document title to its default, bracketed
  // state in the case of re-generating a title
  const resetDocumentTitle =
    (filingEvent && filingEvent.documentTitle) ||
    documentMetadata.documentTitle;

  const courtIssuedDocument = CourtIssuedDocumentFactory({
    ...documentMetadata,
    documentTitle: resetDocumentTitle,
  });

  return courtIssuedDocument.getDocumentTitle();
};
