import { clearDocketRecordTableSortAction } from '@web-client/presenter/actions/clearDocketRecordTableSortAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearDocketRecordTableSortAction', () => {
  it('should clear docket record table sort', async () => {
    const { state } = await runAction(clearDocketRecordTableSortAction, {
      state: {
        DOCKET_RECORD_TABLE_SORT: {
          sortField: 'TEST_sortField',
          sortOrder: 'TEST_sortOrder',
        },
      },
    });

    expect(state['DOCKET_RECORD_TABLE_SORT'].sortField).toEqual(undefined);
    expect(state['DOCKET_RECORD_TABLE_SORT'].sortOrder).toEqual(undefined);
  });
});
