import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.workitemAllCheckbox to false
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearSelectAllWorkItemsCheckboxAction = ({
  store,
}: ActionProps) => {
  store.set(state.workitemAllCheckbox, false);
};
