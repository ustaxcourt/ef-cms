import {
  ASCENDING,
  DESCENDING,
} from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const setDocketClerkReportMessagesTableSortAction = ({
  props,
  store,
}: ActionProps<{ box?: string }>) => {
  const box = props.box || 'inbox';

  if (box === 'sent') {
    store.set(state.tableSort.sortField, 'createdAt');
    store.set(state.tableSort.sortOrder, DESCENDING);
  } else if (box === 'completed') {
    store.set(state.tableSort.sortField, 'completedAt');
    store.set(state.tableSort.sortOrder, DESCENDING);
  } else {
    store.set(state.tableSort.sortField, 'createdAt');
    store.set(state.tableSort.sortOrder, ASCENDING);
  }
};
