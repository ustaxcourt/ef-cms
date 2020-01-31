import { state } from 'cerebral';

/**
 * set the state form props if a court issued event code is present
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.applicationContext the application context
 */
export const initCourtIssuedOrderFormPropsFromEventCodeAction = ({
  applicationContext,
  props,
  store,
}) => {
  const { COURT_ISSUED_EVENT_CODES } = applicationContext.getConstants();

  const eventCode = props.initEventCode;

  const item = COURT_ISSUED_EVENT_CODES.find(
    item => item.eventCode === eventCode,
  );

  if (item) {
    ['documentType', 'documentTitle', 'eventCode', 'scenario'].forEach(key =>
      store.set(state.form[key], item[key]),
    );
  }
};
