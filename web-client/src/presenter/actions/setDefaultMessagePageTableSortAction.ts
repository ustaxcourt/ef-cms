import { getConstants } from '../../getConstants';
import { state } from '@web-client/presenter/app.cerebral';
const { ASCENDING, DESCENDING } = getConstants();

export const setDefaultMessagePageTableSortAction = ({
  props,
  store,
}: ActionProps<{ box: string }>) => {
  const { box } = props;
  if (box === 'inbox') {
    store.set(state.tableSort.sortField, 'createdAt');
    store.set(state.tableSort.sortOrder, ASCENDING);
  } else if (box === 'outbox') {
    store.set(state.tableSort.sortField, 'createdAt');
    store.set(state.tableSort.sortOrder, DESCENDING);
  } else if (box === 'completed') {
    store.set(state.tableSort.sortField, 'completedAt');
    store.set(state.tableSort.sortOrder, DESCENDING);
  }
};
