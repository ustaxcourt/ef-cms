import { state } from '@web-client/presenter/app.cerebral';

/**
 * set the state form props if a court issued event code is present
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.applicationContext the application context
 */
export const initCourtIssuedOrderFormPropsFromEventCodeAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const { COURT_ISSUED_EVENT_CODES } = applicationContext.getConstants();

  const eventCode = get(state.form.eventCode);

  const selectedDocumentProps = COURT_ISSUED_EVENT_CODES.find(
    item => item.eventCode === eventCode,
  );

  if (selectedDocumentProps) {
    ['documentType', 'documentTitle', 'eventCode', 'scenario'].forEach(key =>
      store.set(state.form[key], selectedDocumentProps[key]),
    );
  }
};
