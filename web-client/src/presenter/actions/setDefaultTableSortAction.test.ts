import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getConstants } from '../../getConstants';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultTableSortAction } from './setDefaultTableSortAction';

const { ASCENDING, DESCENDING } = getConstants();

describe('setDefaultTableSortAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should keep the default values of tableSort for internal users with invalid box value', async () => {
    const { state } = await runAction(setDefaultTableSortAction, {
      modules: {
        presenter,
      },
      props: {
        box: 'invalid',
      },
      state: {
        tableSort: {
          sortField: 'createdAt',
          sortOrder: ASCENDING,
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
    const { state } = await runAction(setDefaultTableSortAction, {
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
    const { state } = await runAction(setDefaultTableSortAction, {
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

  it('the completed should be sorted by createdAt DESCENDING for internal users', async () => {
    const { state } = await runAction(setDefaultTableSortAction, {
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
