import {
  ASCENDING,
  DESCENDING,
} from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDocketClerkReportMessagesTableSortAction } from './setDocketClerkReportMessagesTableSortAction';

describe('setDocketClerkReportMessagesTableSortAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should default to createdAt ascending when no box is provided', async () => {
    const { state } = await runAction(
      setDocketClerkReportMessagesTableSortAction,
      {
        modules: {
          presenter,
        },
        props: {},
      },
    );

    expect(state.tableSort.sortField).toEqual('createdAt');
    expect(state.tableSort.sortOrder).toEqual(ASCENDING);
  });

  it('should sort the inbox by createdAt ascending', async () => {
    const { state } = await runAction(
      setDocketClerkReportMessagesTableSortAction,
      {
        modules: {
          presenter,
        },
        props: {
          box: 'inbox',
        },
      },
    );

    expect(state.tableSort.sortField).toEqual('createdAt');
    expect(state.tableSort.sortOrder).toEqual(ASCENDING);
  });

  it('should sort the sent box by createdAt descending', async () => {
    const { state } = await runAction(
      setDocketClerkReportMessagesTableSortAction,
      {
        modules: {
          presenter,
        },
        props: {
          box: 'sent',
        },
      },
    );

    expect(state.tableSort.sortField).toEqual('createdAt');
    expect(state.tableSort.sortOrder).toEqual(DESCENDING);
  });

  it('should sort the completed box by completedAt descending', async () => {
    const { state } = await runAction(
      setDocketClerkReportMessagesTableSortAction,
      {
        modules: {
          presenter,
        },
        props: {
          box: 'completed',
        },
      },
    );

    expect(state.tableSort.sortField).toEqual('completedAt');
    expect(state.tableSort.sortOrder).toEqual(DESCENDING);
  });
});
