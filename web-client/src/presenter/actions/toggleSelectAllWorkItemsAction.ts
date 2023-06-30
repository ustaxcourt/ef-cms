import { state } from '@web-client/presenter/app.cerebral';

// eslint-disable-next-line spellcheck/spell-checker
/**
 * Negates workitemAllCheckbox and:
 * checks/unchecks all work items as appropriate
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the Cerebral get object
 * @param {object} providers.store the Cerebral store object
 */
export const toggleSelectAllWorkItemsAction = ({ get, store }: ActionProps) => {
  const allCheckboxPreviousState = get(state.workitemAllCheckbox);
  const formattedWorkQueue = get(state.formattedWorkQueue);

  if (!allCheckboxPreviousState) {
    store.set(state.selectedWorkItems, [...formattedWorkQueue]);
  } else {
    store.set(state.selectedWorkItems, []);
  }

  store.set(state.workitemAllCheckbox, !allCheckboxPreviousState);
};
