import { state } from 'cerebral';

/**
 * get the selected work items from state
 *
 * @param {Object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting the selectedWorkItems
 * @returns {Object} a list of selected work items
 */
export default async ({ get }) => {
  return get(state.selectedWorkItems);
};
