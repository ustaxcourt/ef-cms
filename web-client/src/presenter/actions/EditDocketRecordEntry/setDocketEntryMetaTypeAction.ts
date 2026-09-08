import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * set the edit type on screenMetadata
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the utility method
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const setDocketEntryMetaTypeAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const { docketEntryId, eventCode, scenario } = get(state.form);

  const {
    COURT_ISSUED_EVENT_CODES,
    INTERNAL_DOCUMENTS_ARRAY,
    SYSTEM_GENERATED_DOCUMENT_TYPES,
  } = applicationContext.getConstants();
  const COURT_ISSUED_EVENT_CODES_LIST = COURT_ISSUED_EVENT_CODES.map(
    courtIssuedEvent => courtIssuedEvent.eventCode,
  );

  COURT_ISSUED_EVENT_CODES_LIST.push(
    SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfDocketChange.eventCode,
  );

  const isInternalFilingEvent = INTERNAL_DOCUMENTS_ARRAY.some(
    internalFilingEvent =>
      internalFilingEvent.eventCode === eventCode &&
      internalFilingEvent.scenario === scenario,
  );

  const hasDocument = !DocketEntry.isMinuteEntry({ eventCode });

  const isCourtIssuedDocument =
    hasDocument &&
    COURT_ISSUED_EVENT_CODES_LIST.includes(eventCode) &&
    !isInternalFilingEvent;

  let editType;

  if (!hasDocument) {
    editType = 'NoDocument';
  } else if (isCourtIssuedDocument) {
    editType = 'CourtIssued';
  } else {
    editType = 'Document';
  }

  store.set(state.docketEntryId, docketEntryId);
  store.set(state.screenMetadata.editType, editType);
};
