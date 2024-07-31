import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.form to the props.value passed in
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const clearJurisdictionRadioAction = ({ props, store }: ActionProps) => {
  if (props.key === 'strickenFromTrialSessions' && !props.value) {
    store.unset(state.form.jurisdiction);
  }
};
