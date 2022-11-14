import { runAction } from 'cerebral/test';
import { setInitialTableSortAction } from './setInitialTableSortAction';

describe('setInitialTableSortAction', () => {
  it('should set state.tableSort to uploadDate ascending', async () => {
    const { state } = await runAction(setInitialTableSortAction);

    expect(state.tableSort).toEqual({
      sortField: 'uploadDate',
      sortOrder: 'asc',
    });
  });
});
