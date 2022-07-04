import { state } from 'cerebral';

/**
 * clears the optional fields on the Apply Stamp form
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearOptionalFieldsStampFormAction = ({ store }) => {
  store.unset(state.form.strickenCase);
  store.unset(state.form.jurisdiction);
  store.unset(state.form.dueDateMessage);
  store.unset(state.form.dueDateDay);
  store.unset(state.form.dueDateMonth);
  store.unset(state.form.dueDateYear);
};
