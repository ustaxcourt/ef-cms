import { state } from 'cerebral';

/**
 * Sets the pending items property in the state
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting pendingItems
 * @param {object} providers.props the pendingItems to set
 */
export const setPendingItemsAction = ({ props, store }) => {
  store.set(state.pendingItems, props.pendingItems);
};
