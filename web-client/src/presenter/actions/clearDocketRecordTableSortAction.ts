import { KEYS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const clearDocketRecordTableSortAction = ({ store }: ActionProps) => {
  store.unset(state[KEYS.DOCKET_RECORD_TABLE_SORT].sortField);
  store.unset(state[KEYS.DOCKET_RECORD_TABLE_SORT].sortOrder);
};
