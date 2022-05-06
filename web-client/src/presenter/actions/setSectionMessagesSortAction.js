import { state } from 'cerebral';

/**
 * toggle the sort for the clicked sortable table button
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.get the cerebral get function
 */
export const setSectionMessagesSortAction = ({ get, props, store }) => {
  const { sortField } = props;
  const fromSortOrder = get(state.tableSort.sortOrder);
  let newSortOrder = fromSortOrder === 'desc' ? 'asc' : 'desc';
  store.set(state.tableSort.sortField, sortField);
  store.set(state.tableSort.sortOrder, newSortOrder);
};
