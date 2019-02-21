import { state } from 'cerebral';

/**
 *  resets the workItemActions.
 *  state.workItemActions is used for knowing which toggle button (forward, history, complete) was clicked in the document details page
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for setting workItemActions
 */
export default ({ store }) => {
  store.set(state.workItemActions, {});
};
