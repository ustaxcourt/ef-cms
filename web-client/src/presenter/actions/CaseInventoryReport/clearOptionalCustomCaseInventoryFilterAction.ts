import { state } from 'cerebral';

/**
 * clears the case inventory report data
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const clearOptionalCustomCaseInventoryFilterAction = ({ store }) => {
  store.set(state.customCaseInventory.filters.caseStatuses, []);
  store.set(state.customCaseInventory.filters.caseTypes, []);
};
