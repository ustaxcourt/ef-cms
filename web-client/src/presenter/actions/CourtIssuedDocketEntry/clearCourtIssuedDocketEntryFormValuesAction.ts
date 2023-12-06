import { state } from '@web-client/presenter/app.cerebral';

/**
 * clears values on the court-issued docket entry form if the event code was changed
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const clearCourtIssuedDocketEntryFormValuesAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const scenariosWhichIncludeFreeText = [
    'Type A',
    'Type B',
    'Type D',
    'Type H',
  ];
  if (props.key === 'eventCode' && props.value) {
    const eventCodes =
      applicationContext.getConstants().COURT_ISSUED_EVENT_CODES;

    const eventCodeObject = eventCodes.find(e => e.eventCode === props.value);

    const shouldClearFreeTextField =
      !scenariosWhichIncludeFreeText.includes(eventCodeObject.scenario) ||
      get(state.form.freeText) === 'Order' ||
      get(state.form.freeText) === 'Notice';

    if (shouldClearFreeTextField) {
      store.unset(state.form.freeText);
    }
    store.unset(state.form.judge);
    store.unset(state.form.docketNumbers);
    store.unset(state.form.trialLocation);
    store.unset(state.form.date);
  }
};
