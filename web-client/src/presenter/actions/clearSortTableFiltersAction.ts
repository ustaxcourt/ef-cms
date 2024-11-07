import { state } from '@web-client/presenter/app.cerebral';

export const clearSortTableFiltersAction = ({ store }: ActionProps) => {
  store.unset(state.tableSort.sortField);
  store.unset(state.tableSort.sortOrder);
};
