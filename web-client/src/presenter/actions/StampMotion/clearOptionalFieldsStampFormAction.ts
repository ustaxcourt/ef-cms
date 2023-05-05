import { state } from 'cerebral';

/**
 * clears the optional fields on the Apply Stamp form
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearOptionalFieldsStampFormAction = ({ store }: ActionProps) => {
  store.unset(state.form.strickenFromTrialSession);
  store.unset(state.form.jurisdictionalOption);

  store.unset(state.form.dueDateMessage);
  store.set(state.form.customText, '');
  store.unset(state.form['day']);
  store.unset(state.form['month']);
  store.unset(state.form['year']);
};
