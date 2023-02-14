import { state } from 'cerebral';

/**
 * sets the state.selectedWorkItems to an empty list
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearSelectedWorkItemsAction = ({ store }) => {
  store.set(state.selectedWorkItems, []);
};
