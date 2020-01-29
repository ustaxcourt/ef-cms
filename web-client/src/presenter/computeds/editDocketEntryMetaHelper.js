import { state } from 'cerebral';

export const editDocketEntryMetaHelper = (get, applicationContext) => {
  const { docketRecordEntry, documentDetail } = get(state.form);
  const { COURT_ISSUED_EVENT_CODES } = applicationContext.getConstants();
  const COURT_ISSUED_EVENT_CODES_MAP = COURT_ISSUED_EVENT_CODES.map(
    courtIssuedEvent => courtIssuedEvent.eventCode,
  );

  const hasDocument =
    docketRecordEntry.documentId && documentDetail && documentDetail.documentId;

  const isCourtIssuedDocument =
    hasDocument &&
    COURT_ISSUED_EVENT_CODES_MAP.includes(documentDetail.eventCode);

  let docketEntryMetaFormComponent;
  let validationSequenceName = 'validateDocketRecordSequence';
  let submitSequenceName;

  if (!hasDocument) {
    docketEntryMetaFormComponent = 'NoDocument';
  } else if (isCourtIssuedDocument) {
    docketEntryMetaFormComponent = 'CourtIssued';
  } else {
    docketEntryMetaFormComponent = 'Document';
  }

  // TODO: Some logic to determine docketEntryMetaFormComponent value (one of: CourtIssued, Document, or NoDocument)

  return {
    docketEntryMetaFormComponent,
    submitSequenceName,
    validationSequenceName,
  };
};
