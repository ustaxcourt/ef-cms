import { getConstants } from '../../getConstants';
import { state } from '@web-client/presenter/app.cerebral';
const { ASCENDING, DESCENDING } = getConstants();

/**
 * sets the default sort based on the section picked.
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the props passed to the sequence
 * @param {object} providers.store the cerebral store object
 */
export const setDefaultTableSortAction = ({ props, store }: ActionProps) => {
  // different tables require different default sorting
  if (props.box === 'inbox') {
    store.set(state.tableSort.sortField, 'createdAt');
    store.set(state.tableSort.sortOrder, ASCENDING);
  } else if (props.box === 'outbox') {
    store.set(state.tableSort.sortField, 'createdAt');
    store.set(state.tableSort.sortOrder, DESCENDING);
  } else if (props.box === 'completed') {
    store.set(state.tableSort.sortField, 'completedAt');
    store.set(state.tableSort.sortOrder, DESCENDING);
  }
};
