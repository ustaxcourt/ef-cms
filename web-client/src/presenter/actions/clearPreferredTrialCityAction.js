import { state } from 'cerebral';

/**
 * unsets the state.form.preferredTrialCity property
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearPreferredTrialCityAction = ({ store }) => {
  store.unset(state.form['preferredTrialCity']);
};
