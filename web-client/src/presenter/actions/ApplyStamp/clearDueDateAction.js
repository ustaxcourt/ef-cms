import { state } from 'cerebral';

/**
 * clears the due date fields on the Apply Stamp form
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearDueDateAction = ({ store }) => {
  store.unset(state.form['dueDateDay-stipDecision']);
  store.unset(state.form['dueDateMonth-stipDecision']);
  store.unset(state.form['dueDateYear-stipDecision']);

  store.unset(state.form['dueDateDay-statusReport']);
  store.unset(state.form['dueDateMonth-statusReport']);
  store.unset(state.form['dueDateYear-statusReport']);
};
