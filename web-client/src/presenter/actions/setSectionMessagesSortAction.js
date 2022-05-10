import { ASCENDING, DESCENDING } from '../presenterConstants';
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
  // TODO: UNIT TEST THIS
  const { sortField } = props;
  const fromSortOrder = get(state.tableSort.fields[sortField].sortOrder);
  if (get(state.tableSort.sortField) !== sortField) {
    store.set(
      state.tableSort.fields[sortField],
      state.tableSort.fields[sortField].defaultSortOrder,
    );
  } else {
    const newSortOrder = fromSortOrder === DESCENDING ? ASCENDING : DESCENDING;
    store.set(state.tableSort.fields[sortField].sortOrder, newSortOrder);
  }
  store.set(state.tableSort.sortField, sortField);
};
