import { state } from '@web-client/presenter/app.cerebral';

/**
 * gets the eventCode of the selected document from the caseDetail.docketEntries, then sets the
 * eventCode, documentType, documentTitle, and scenario on the form for the selected
 * document from the COURT_ISSUED_EVENT_CODES
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setCourtIssuedDocumentInitialDataAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const { docketEntries } = get(state.caseDetail);

  const docketEntry = docketEntries.find(
    item => item.docketEntryId === props.docketEntryId,
  );

  if (docketEntry) {
    const { COURT_ISSUED_EVENT_CODES } = applicationContext.getConstants();

    const selectedDocumentTypeValues = COURT_ISSUED_EVENT_CODES.find(
      option => option.eventCode === docketEntry.eventCode,
    );

    if (selectedDocumentTypeValues) {
      store.set(state.form, { ...selectedDocumentTypeValues }); //to prevent against modifying constants
      store.set(state.form.attachments, false);
    }

    if (docketEntry.freeText) {
      store.set(state.form.freeText, docketEntry.freeText);
    }
  }
};
