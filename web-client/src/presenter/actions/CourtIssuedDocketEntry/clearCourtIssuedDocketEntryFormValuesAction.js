import { state } from 'cerebral';

/**
 * clears values on the court-issued docket entry form if the event code was changed
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const clearCourtIssuedDocketEntryFormValuesAction = ({
  props,
  store,
}) => {
  if (props.key === 'eventCode') {
    store.unset(state.form.freeText);
    store.unset(state.form.judge);
    store.unset(state.form.docketNumbers);
    store.unset(state.form.month);
    store.unset(state.form.day);
    store.unset(state.form.year);
  }
};
