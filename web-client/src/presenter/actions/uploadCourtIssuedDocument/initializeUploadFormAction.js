import { state } from 'cerebral';

/**
 * initialize the form for upload pdf
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.store the cerebral store
 */
export const initializeUploadFormAction = ({ applicationContext, store }) => {
  const defaultEventCode = 'MISC';

  const { COURT_ISSUED_EVENT_CODES } = applicationContext.getConstants();
  const defaultEntry = COURT_ISSUED_EVENT_CODES.find(
    courtIssuedEvent => courtIssuedEvent.eventCode === defaultEventCode,
  );

  store.set(state.form, { ...defaultEntry });
};
