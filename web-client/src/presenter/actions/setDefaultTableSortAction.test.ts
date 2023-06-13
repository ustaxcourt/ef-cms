import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getConstants } from '../../getConstants';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultTableSortAction } from './setDefaultTableSortAction';

const { ASCENDING, DESCENDING } = getConstants();

describe('setDefaultTableSortAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should keep the default values of tableSort for adc user with invalid box value', async () => {
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

  it('the inbox should be sorted by createdAt ascending for adc user', async () => {
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

  it('the outbox should be sorted by createdAt DESCENDING for adc user', async () => {
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

  it('the completed should be sorted by createdAt DESCENDING for adc user', async () => {
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

  it('should not set the tableSort if role is not ADC', async () => {
    const { state } = await runAction(setDefaultTableSortAction, {
      modules: {
        presenter,
      },
      props: {
        box: 'inbox',
      },
      state: {
        tableSort: {
          sortField: 'createdAt',
          sortOrder: 'asc',
        },
        user: {
          role: 'docketclerk',
        },
      },
    });

    expect(state.tableSort).toBeUndefined();
  });
});
