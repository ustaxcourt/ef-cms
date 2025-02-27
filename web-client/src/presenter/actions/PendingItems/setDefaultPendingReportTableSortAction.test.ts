import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultPendingReportTableSortAction } from '@web-client/presenter/actions/PendingItems/setDefaultPendingReportTableSortAction';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';

describe('setDefaultPendingReportTableSortAction', () => {
  it('should set default sorting settings in state', async () => {
    const { state } = await runAction(setDefaultPendingReportTableSortAction, {
      state: {},
    });

    expect(state[STATE_KEYS.PENDING_REPORT_TABLE_SORT]).toEqual({
      sortField: 'receivedAt',
      sortOrder: 'asc',
    });
  });
});
