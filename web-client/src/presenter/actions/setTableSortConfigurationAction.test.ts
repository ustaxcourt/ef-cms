import {
  ASCENDING,
  DESCENDING,
} from '@shared/business/entities/EntityConstants';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setTableSortConfigurationAction } from './setTableSortConfigurationAction';

describe('setTableSortConfigurationAction', () => {
  it('should set the field to sort and the sort order', async () => {
    const { state } = await runAction(setTableSortConfigurationAction, {
      props: { sortField: 'createdAt', sortOrder: ASCENDING },
      state: {
        tableSort: {
          sortField: 'recievedAt',
          sortOrder: DESCENDING,
        },
      },
    });

    expect(state.tableSort).toEqual({
      sortField: 'createdAt',
      sortOrder: ASCENDING,
    });
  });
});
