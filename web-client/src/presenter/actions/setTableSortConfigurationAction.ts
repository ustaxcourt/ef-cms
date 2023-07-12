import { getConstants } from '../../getConstants';
import { state } from 'cerebral';

const { ASCENDING, DESCENDING } = getConstants();

/**
 * toggle the sort for the clicked sortable table button
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.get the cerebral get function
 */
export const setTableSortConfigurationAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { defaultSort, sortField } = props;
  const fromSortOrder = get(state.tableSort.sortOrder);
  if (get(state.tableSort.sortField) !== sortField) {
    store.set(state.tableSort.sortOrder, defaultSort);
  } else {
    const newSortOrder = fromSortOrder === DESCENDING ? ASCENDING : DESCENDING;
    store.set(state.tableSort.sortOrder, newSortOrder);
  }
  store.set(state.tableSort.sortField, sortField);
};
