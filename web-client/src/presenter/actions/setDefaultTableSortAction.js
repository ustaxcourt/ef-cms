import { state } from 'cerebral';

/**
 * sets the default sort based on the section picked.
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the props passed to the sequence
 * @param {object} providers.store the cerebral store object
 */
export const setDefaultTableSortAction = ({ get, props, store }) => {
  // Story 9490 requires the sorting to only apply to the ADC Section boxes.  So these if statements exist to limit the scope for now.  These if statements can be removed in future stories that expand the scope.
  const userRole = get(state.user.role);
  if (props.queue !== 'section' || userRole !== 'adc') {
    store.unset(state.tableSort);
    return;
  }

  // different tables require different sorting
  if (props.box === 'inbox') {
    store.set(state.tableSort.sortField, 'createdAt');
    store.set(state.tableSort.sortOrder, 'asc');
  } else if (props.box === 'outbox') {
    store.set(state.tableSort.sortField, 'createdAt');
    store.set(state.tableSort.sortOrder, 'desc');
  } else if (props.box === 'completed') {
    store.set(state.tableSort.sortField, 'completedAt');
    store.set(state.tableSort.sortOrder, 'desc');
  }
};
