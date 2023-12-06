import { state } from '@web-client/presenter/app.cerebral';

/**
 * clears the due date fields on the Apply Stamp form
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearDueDateAction = ({ store }: ActionProps) => {
  store.unset(state.form.day);
  store.unset(state.form.month);
  store.unset(state.form.year);
};
