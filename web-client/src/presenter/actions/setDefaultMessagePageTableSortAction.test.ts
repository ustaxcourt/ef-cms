import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getConstants } from '../../getConstants';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultMessagePageTableSortAction } from './setDefaultMessagePageTableSortAction';

const { ASCENDING, DESCENDING } = getConstants();

describe('setDefaultMessagePageTableSortAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should fall back to the inbox default sort for an unrecognized box value', async () => {
    const { state } = await runAction(setDefaultMessagePageTableSortAction, {
      modules: {
        presenter,
      },
      props: {
        box: 'invalid',
      },
      state: {
        tableSort: {
          sortField: 'completedAt',
          sortOrder: DESCENDING,
        },
        user: {
          role: 'adc',
        },
      },
    });

    expect(state.tableSort.sortField).toEqual('createdAt');
    expect(state.tableSort.sortOrder).toEqual(ASCENDING);
  });

  it('the inbox should be sorted by createdAt ascending for internal users', async () => {
    const { state } = await runAction(setDefaultMessagePageTableSortAction, {
      modules: {
        presenter,
      },
      props: {
        box: 'inbox',
      },
      state: {
        user: {
          role: 'adc',
        },
      },
    });

    expect(state.tableSort.sortField).toEqual('createdAt');
    expect(state.tableSort.sortOrder).toEqual(ASCENDING);
  });

  it('the outbox should be sorted by createdAt DESCENDING for internal users', async () => {
    const { state } = await runAction(setDefaultMessagePageTableSortAction, {
      modules: {
        presenter,
      },
      props: {
        box: 'outbox',
      },
      state: {
        user: {
          role: 'adc',
        },
      },
    });

    expect(state.tableSort.sortField).toEqual('createdAt');
    expect(state.tableSort.sortOrder).toEqual(DESCENDING);
  });

  it('the sent box (Docket Clerk Report messages) should be sorted by createdAt DESCENDING, same as outbox', async () => {
    const { state } = await runAction(setDefaultMessagePageTableSortAction, {
      modules: {
        presenter,
      },
      props: {
        box: 'sent',
      },
      state: {
        user: {
          role: 'adc',
        },
      },
    });

    expect(state.tableSort.sortField).toEqual('createdAt');
    expect(state.tableSort.sortOrder).toEqual(DESCENDING);
  });

  it('should default to the inbox sort when no box is provided', async () => {
    const { state } = await runAction(setDefaultMessagePageTableSortAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        user: {
          role: 'adc',
        },
      },
    });

    expect(state.tableSort.sortField).toEqual('createdAt');
    expect(state.tableSort.sortOrder).toEqual(ASCENDING);
  });

  it('the completed should be sorted by createdAt DESCENDING for internal users', async () => {
    const { state } = await runAction(setDefaultMessagePageTableSortAction, {
      modules: {
        presenter,
      },
      props: {
        box: 'completed',
      },
      state: {
        user: {
          role: 'adc',
        },
      },
    });

    expect(state.tableSort.sortField).toEqual('completedAt');
    expect(state.tableSort.sortOrder).toEqual(DESCENDING);
  });
});
