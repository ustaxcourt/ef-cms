import { clearSortTableFiltersAction } from '@web-client/presenter/actions/clearSortTableFiltersAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearSortTableFiltersAction', () => {
  it('should test', async () => {
    const { state } = await runAction(clearSortTableFiltersAction, {
      state: {
        tableSort: {
          sortField: 'TEST_sortField',
          sortOrder: 'TEST_sortOrder',
        },
      },
    });

    expect(state.tableSort.sortField).toEqual(undefined);
    expect(state.tableSort.sortOrder).toEqual(undefined);
  });
});
