import { state } from 'cerebral';

// eslint-disable-next-line spellcheck/spell-checker
/**
 * Negates workitemAllCheckbox and:
 *   checks/unchecks all work items as appropriate
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the Cerebral get object
 * @param {object} providers.store the Cerebral store object
 */
export const flipWorkItemAllCheckboxAction = ({ get, store }) => {
  const allCheckboxPreviousState = get(state.workitemAllCheckbox);

  let formattedWorkQueue = get(state.formattedWorkQueue);
  console.log('workItems before', formattedWorkQueue);

  formattedWorkQueue = formattedWorkQueue.map(workItem => {
    return {
      ...workItem,
      selected: !allCheckboxPreviousState,
    };
  });

  console.log('workItems after', formattedWorkQueue);

  store.set(state.workitemAllCheckbox, !allCheckboxPreviousState);
  store.set(state.formattedWorkQueue, formattedWorkQueue);
};
