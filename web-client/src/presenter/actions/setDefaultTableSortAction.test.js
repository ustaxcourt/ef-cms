import { ASCENDING, DESCENDING } from '../presenterConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDefaultTableSortAction } from './setDefaultTableSortAction';

describe('setDefaultTableSortAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('the inbox should be sorted by createdAt ascending for adc user', async () => {
    const { state } = await runAction(setDefaultTableSortAction, {
      modules: {
        presenter,
      },
      props: {
        box: 'inbox',
        queue: 'section',
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
        queue: 'section',
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
        queue: 'section',
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
        queue: 'section',
      },
      state: {
        user: {
          role: 'docketclerk',
        },
      },
    });

    expect(state.tableSort).toBeUndefined();
  });

  it('should not set the tableSort if queue is not section', async () => {
    const { state } = await runAction(setDefaultTableSortAction, {
      modules: {
        presenter,
      },
      props: {
        box: 'inbox',
        queue: 'my',
      },
      state: {
        user: {
          role: 'adc',
        },
      },
    });

    expect(state.tableSort).toBeUndefined();
  });
});
