import { state } from 'cerebral';

/**
 * sets the default sort based on the section picked.
 *
 * @param {object} props the props passed to the sequence
 * @param {object} store the cerebral store object
 */
export const setDefaultTableSortAction = ({ props, store }) => {
  if (props.box === 'completed' && props.queue === 'section') {
    store.set(state.tableSort.sortField, 'completedAt');
    store.set(state.tableSort.sortOrder, 'asc');
  }
};
