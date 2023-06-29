import { state } from '@web-client/presenter/app.cerebral';

/**
 * unsets the state.form.preferredTrialCity property
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearPreferredTrialCityAction = ({ store }: ActionProps) => {
  store.unset(state.form['preferredTrialCity']);
};
