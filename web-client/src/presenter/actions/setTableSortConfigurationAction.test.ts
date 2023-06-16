import { getConstants } from '../../getConstants';

import { runAction } from '@web-client/presenter/test.cerebral';
import { setTableSortConfigurationAction } from './setTableSortConfigurationAction';
const { ASCENDING, DESCENDING } = getConstants();

describe('setTableSortConfigurationAction', () => {
  it('should return default sortOrder', async () => {
    const { state } = await runAction(setTableSortConfigurationAction, {
      props: { defaultSort: ASCENDING, sortField: 'createdAt' },
      state: {
        tableSort: {
          sortField: 'recievedAt',
        },
      },
    });

    expect(state.tableSort).toMatchObject({
      sortOrder: ASCENDING,
    });
  });

  it('should return correct sortField', async () => {
    const NEW_SORT_FIELD = 'createdAt';

    const { state } = await runAction(setTableSortConfigurationAction, {
      props: { defaultSort: ASCENDING, sortField: NEW_SORT_FIELD },
      state: {
        tableSort: {
          sortField: 'recievedAt',
        },
      },
    });

    expect(state.tableSort).toMatchObject({
      sortField: NEW_SORT_FIELD,
    });
  });

  it('should return descending sortOrder if sort fields match and sortOrder is ascending', async () => {
    const SORT_FIELD = 'docketNumber';

    const { state } = await runAction(setTableSortConfigurationAction, {
      props: { defaultSort: ASCENDING, sortField: SORT_FIELD },
      state: {
        tableSort: {
          sortField: SORT_FIELD,
          sortOrder: ASCENDING,
        },
      },
    });

    expect(state.tableSort).toEqual({
      sortField: SORT_FIELD,
      sortOrder: DESCENDING,
    });
  });

  it('should return ascending sortOrder if sort fields match and sortOrder is descending', async () => {
    const SORT_FIELD = 'createdAt';

    const { state } = await runAction(setTableSortConfigurationAction, {
      props: { defaultSort: ASCENDING, sortField: SORT_FIELD },
      state: {
        tableSort: {
          sortField: SORT_FIELD,
          sortOrder: DESCENDING,
        },
      },
    });

    expect(state.tableSort).toEqual({
      sortField: SORT_FIELD,
      sortOrder: ASCENDING,
    });
  });

  it('should return default table sort values if tableSort is not set', async () => {
    const SORT_FIELD = 'createdAt';

    const { state } = await runAction(setTableSortConfigurationAction, {
      props: { defaultSort: ASCENDING, sortField: SORT_FIELD },
      state: {},
    });

    expect(state.tableSort).toEqual({
      sortField: SORT_FIELD,
      sortOrder: ASCENDING,
    });
  });
});
