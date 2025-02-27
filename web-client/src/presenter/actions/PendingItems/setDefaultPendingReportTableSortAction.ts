import { state } from '@web-client/presenter/app.cerebral';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';

export const setDefaultPendingReportTableSortAction = ({
  store,
}: ActionProps) => {
  store.set(state[STATE_KEYS.PENDING_REPORT_TABLE_SORT], {
    sortField: 'receivedAt',
    sortOrder: 'asc',
  });
};
