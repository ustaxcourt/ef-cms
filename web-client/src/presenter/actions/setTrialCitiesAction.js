import { state } from 'cerebral';

/**
 * sets the state.form.trialCities to the props.trialCities passed in.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting state.form.trialCities
 * @param {Object} providers.props the cerebral props object used for getting the props.trialCities
 */
export const setTrialCitiesAction = ({ store, props }) => {
  store.set(state.form.trialCities, props.trialCities);
};
