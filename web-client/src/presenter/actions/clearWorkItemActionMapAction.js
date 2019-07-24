import { state } from 'cerebral';

/**
 *  resets the workItemActions.
 *  state.workItemActions is used for knowing which toggle button (forward, history, complete) was clicked in the document details page
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting workItemActions
 */
export const clearWorkItemActionMapAction = ({ store }) => {
  store.set(state.workItemActions, {});
};
