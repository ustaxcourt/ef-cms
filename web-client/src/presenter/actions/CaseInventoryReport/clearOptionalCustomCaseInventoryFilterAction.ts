import { state } from '@web-client/presenter/app.cerebral';

export const clearOptionalCustomCaseInventoryFilterAction = ({
  store,
}: ActionProps) => {
  store.set(state.customCaseInventory.filters.caseStatuses, []);
  store.set(state.customCaseInventory.filters.caseTypes, []);
  store.set(state.customCaseInventory.filters.judges, []);
  store.set(state.customCaseInventory.filters.preferredTrialCities, []);
};
