import { state } from 'cerebral';

/**
 * set the edit type on screenMetadata
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the utility method
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const setDocketEntryMetaTypeAction = ({
  applicationContext,
  get,
  store,
}) => {
  const { documentId, eventCode } = get(state.form);

  const { COURT_ISSUED_EVENT_CODES } = applicationContext.getConstants();
  const COURT_ISSUED_EVENT_CODES_MAP = COURT_ISSUED_EVENT_CODES.map(
    courtIssuedEvent => courtIssuedEvent.eventCode,
  );

  const hasDocument = !!documentId;

  const isCourtIssuedDocument =
    hasDocument && COURT_ISSUED_EVENT_CODES_MAP.includes(eventCode);

  let editType;

  if (!hasDocument) {
    editType = 'NoDocument';
  } else if (isCourtIssuedDocument) {
    editType = 'CourtIssued';
  } else {
    editType = 'Document';
  }

  store.set(state.documentId, documentId);
  store.set(state.screenMetadata.editType, editType);
};
