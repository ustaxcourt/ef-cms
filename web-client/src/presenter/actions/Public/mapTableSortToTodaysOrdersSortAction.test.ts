import { mapTableSortToTodaysOrdersSortAction } from './mapTableSortToTodaysOrdersSortAction';
import { presenter } from '../../presenter-public';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('mapTableSortToTodaysOrdersSortAction', () => {
  it('maps caseCaption asc to CASE_CAPTION_ASC', async () => {
    const result = await runAction(mapTableSortToTodaysOrdersSortAction, {
      modules: { presenter },
      props: { sortField: 'caseCaption', sortOrder: 'asc' as const },
      state: {
        sessionMetadata: { todaysOrdersSort: '' },
        todaysOrders: { page: 2 },
        todaysOrdersCurrentPaginationPage: 3,
      },
    });

    expect(result.state.sessionMetadata.todaysOrdersSort).toBe(
      'CASE_CAPTION_ASC',
    );
    expect(result.state.todaysOrders.page).toBe(1);
    expect(result.state.todaysOrdersCurrentPaginationPage).toBe(0);
  });

  it('maps caseCaption desc to CASE_CAPTION_DESC', async () => {
    const result = await runAction(mapTableSortToTodaysOrdersSortAction, {
      modules: { presenter },
      props: { sortField: 'caseCaption', sortOrder: 'desc' as const },
      state: {
        sessionMetadata: { todaysOrdersSort: '' },
        todaysOrders: { page: 2 },
        todaysOrdersCurrentPaginationPage: 3,
      },
    });

    expect(result.state.sessionMetadata.todaysOrdersSort).toBe(
      'CASE_CAPTION_DESC',
    );
  });

  it('maps formattedJudgeName asc to JUDGE_NAME_ASC', async () => {
    const result = await runAction(mapTableSortToTodaysOrdersSortAction, {
      modules: { presenter },
      props: { sortField: 'formattedJudgeName', sortOrder: 'asc' as const },
      state: {
        sessionMetadata: { todaysOrdersSort: '' },
        todaysOrders: { page: 2 },
        todaysOrdersCurrentPaginationPage: 3,
      },
    });

    expect(result.state.sessionMetadata.todaysOrdersSort).toBe(
      'JUDGE_NAME_ASC',
    );
  });

  it('maps formattedJudgeName desc to JUDGE_NAME_DESC', async () => {
    const result = await runAction(mapTableSortToTodaysOrdersSortAction, {
      modules: { presenter },
      props: { sortField: 'formattedJudgeName', sortOrder: 'desc' as const },
      state: {
        sessionMetadata: { todaysOrdersSort: '' },
        todaysOrders: { page: 2 },
        todaysOrdersCurrentPaginationPage: 3,
      },
    });

    expect(result.state.sessionMetadata.todaysOrdersSort).toBe(
      'JUDGE_NAME_DESC',
    );
  });

  it('maps filingDate asc to FILING_DATE_ASC', async () => {
    const result = await runAction(mapTableSortToTodaysOrdersSortAction, {
      modules: { presenter },
      props: { sortField: 'filingDate', sortOrder: 'asc' as const },
      state: {
        sessionMetadata: { todaysOrdersSort: '' },
        todaysOrders: { page: 2 },
        todaysOrdersCurrentPaginationPage: 3,
      },
    });

    expect(result.state.sessionMetadata.todaysOrdersSort).toBe(
      'FILING_DATE_ASC',
    );
  });

  it('maps docketNumber desc to DOCKET_NUMBER_DESC', async () => {
    const result = await runAction(mapTableSortToTodaysOrdersSortAction, {
      modules: { presenter },
      props: { sortField: 'docketNumber', sortOrder: 'desc' as const },
      state: {
        sessionMetadata: { todaysOrdersSort: '' },
        todaysOrders: { page: 2 },
        todaysOrdersCurrentPaginationPage: 3,
      },
    });

    expect(result.state.sessionMetadata.todaysOrdersSort).toBe(
      'DOCKET_NUMBER_DESC',
    );
  });

  it('does not update todaysOrdersSort for an unsupported sort field', async () => {
    const result = await runAction(mapTableSortToTodaysOrdersSortAction, {
      modules: { presenter },
      props: { sortField: 'unsupported', sortOrder: 'asc' as const },
      state: {
        sessionMetadata: { todaysOrdersSort: 'FILING_DATE_DESC' },
        todaysOrders: { page: 2 },
        todaysOrdersCurrentPaginationPage: 3,
      },
    });

    expect(result.state.sessionMetadata.todaysOrdersSort).toBe(
      'FILING_DATE_DESC',
    );
    expect(result.state.todaysOrders.page).toBe(1);
    expect(result.state.todaysOrdersCurrentPaginationPage).toBe(0);
  });
});
