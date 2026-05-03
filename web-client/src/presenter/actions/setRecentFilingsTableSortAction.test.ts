import { runAction } from '@web-client/presenter/test.cerebral';
import {
  setDefaultRecentFilingsTableSortAction,
  setRecentFilingsTableSortAction,
} from './setRecentFilingsTableSortAction';

describe('setRecentFilingsTableSortAction', () => {
  it('should set the sort field and sort order in state', async () => {
    const { state } = await runAction(setRecentFilingsTableSortAction, {
      props: {
        sortField: 'docketNumber',
        sortOrder: 'asc',
      },
      state: {
        recentFilingsTableSort: {
          sortField: 'filedDate',
          sortOrder: 'desc',
        },
      },
    });

    expect(state.recentFilingsTableSort.sortField).toBe('docketNumber');
    expect(state.recentFilingsTableSort.sortOrder).toBe('asc');
  });

  it('should set different sort field and order', async () => {
    const { state } = await runAction(setRecentFilingsTableSortAction, {
      props: {
        sortField: 'caseTitle',
        sortOrder: 'desc',
      },
      state: {
        recentFilingsTableSort: {
          sortField: 'filedDate',
          sortOrder: 'desc',
        },
      },
    });

    expect(state.recentFilingsTableSort.sortField).toBe('caseTitle');
    expect(state.recentFilingsTableSort.sortOrder).toBe('desc');
  });
});

describe('setDefaultRecentFilingsTableSortAction', () => {
  it('should set default sort field to filedDate and sort order to desc', async () => {
    const { state } = await runAction(setDefaultRecentFilingsTableSortAction, {
      state: {
        recentFilingsTableSort: {
          sortField: 'docketNumber',
          sortOrder: 'asc',
        },
      },
    });

    expect(state.recentFilingsTableSort.sortField).toBe('filedDate');
    expect(state.recentFilingsTableSort.sortOrder).toBe('desc');
  });

  it('should set default values when state is empty', async () => {
    const { state } = await runAction(setDefaultRecentFilingsTableSortAction, {
      state: {
        recentFilingsTableSort: {},
      },
    });

    expect(state.recentFilingsTableSort.sortField).toBe('filedDate');
    expect(state.recentFilingsTableSort.sortOrder).toBe('desc');
  });
});
