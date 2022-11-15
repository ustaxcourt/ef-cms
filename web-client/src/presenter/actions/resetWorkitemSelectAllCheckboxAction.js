import { state } from 'cerebral';

/**
 * Resets workItemAllCheckbox to false.
 *
 * @param {object} providers.store the Cerebral store object
 */
export const resetWorkitemSelectAllCheckboxAction = ({ store }) => {
  store.set(state.workitemAllCheckbox, false);
};
