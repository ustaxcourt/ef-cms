import { state } from 'cerebral';

/**
 * clears the case inventory report data
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const clearOptionalCustomCaseInventoryFilterAction = ({ store }) => {
  const filtersWithDefaultCaseTypesAndStatus = {
    caseStatuses: [],
    caseTypes: [],
  };
  store.merge(
    state.customCaseInventoryFilters,
    filtersWithDefaultCaseTypesAndStatus,
  );
};
