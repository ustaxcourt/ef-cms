import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const setDefaultDocketEntriesTableSortAction = ({
  store,
}: ActionProps) => {
  store.set(
    state[STATE_KEYS.DOCKET_RECORD_TABLE_SORT].sortField,
    'sortingFilingDate',
  );
  store.set(state[STATE_KEYS.DOCKET_RECORD_TABLE_SORT].sortOrder, 'asc');
};
