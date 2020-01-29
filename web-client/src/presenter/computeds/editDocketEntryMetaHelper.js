import { state } from 'cerebral';

export const editDocketEntryMetaHelper = (get, applicationContext) => {
  const { documentId, eventCode } = get(state.form);

  const { COURT_ISSUED_EVENT_CODES } = applicationContext.getConstants();
  const COURT_ISSUED_EVENT_CODES_MAP = COURT_ISSUED_EVENT_CODES.map(
    courtIssuedEvent => courtIssuedEvent.eventCode,
  );

  const hasDocument = !!documentId;

  const isCourtIssuedDocument =
    hasDocument && COURT_ISSUED_EVENT_CODES_MAP.includes(eventCode);

  let docketEntryMetaFormComponent;

  if (!hasDocument) {
    docketEntryMetaFormComponent = 'NoDocument';
  } else if (isCourtIssuedDocument) {
    docketEntryMetaFormComponent = 'CourtIssued';
  } else {
    docketEntryMetaFormComponent = 'Document';
  }

  return {
    docketEntryMetaFormComponent,
  };
};
