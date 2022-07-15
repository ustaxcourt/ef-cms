import { state } from 'cerebral';

/**
 * clears the optional fields on the Apply Stamp form
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearOptionalFieldsStampFormAction = ({ store }) => {
  store.unset(state.form.strickenFromTrialSession);
  store.unset(state.form.jurisdictionalOption);

  store.unset(state.form.dueDateMessage);
  store.unset(state.form['dueDateDay-stipDecision']);
  store.unset(state.form['dueDateMonth-stipDecision']);
  store.unset(state.form['dueDateYear-stipDecision']);

  store.unset(state.form['dueDateDay-statusReport']);
  store.unset(state.form['dueDateMonth-statusReport']);
  store.unset(state.form['dueDateYear-statusReport']);
};
