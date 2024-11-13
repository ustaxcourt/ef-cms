import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultDocketEntriesTableSortAction } from '@web-client/presenter/actions/setDefaultDocketEntriesTableSortAction';

describe('clearDocketRecordTableSortAction', () => {
  it('should clear docket record table sort', async () => {
    const { state } = await runAction(setDefaultDocketEntriesTableSortAction, {
      state: {
        DOCKET_RECORD_TABLE_SORT: {
          sortField: 'TEST_sortField',
          sortOrder: 'TEST_sortOrder',
        },
      },
    });

    expect(state['DOCKET_RECORD_TABLE_SORT'].sortField).toEqual(
      'sortingFilingDate',
    );
    expect(state['DOCKET_RECORD_TABLE_SORT'].sortOrder).toEqual('asc');
  });
});
