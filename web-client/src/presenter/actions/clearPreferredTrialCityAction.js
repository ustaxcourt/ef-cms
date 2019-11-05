import { state } from 'cerebral';

/**
 * sets the state.form.preferredTrialCity to an empty string
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const clearPreferredTrialCityAction = ({ store }) => {
  store.set(state.form.preferredTrialCity, '');
};
