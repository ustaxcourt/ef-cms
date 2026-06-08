import { ADVANCED_SEARCH_TABS } from '@shared/business/entities/EntityConstants';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDocumentSearchResultsAction } from './setDocumentSearchResultsAction';

describe('setDocumentSearchResultsAction', () => {
  it('should update orderDocumentSearchSort when advancedSearchTab is ORDER', async () => {
    const result = await runAction(setDocumentSearchResultsAction, {
      modules: {
        presenter,
      },
      props: {
        sortColumn: 'numberOfPages',
        sortDirection: 'asc',
      },
      state: {
        advancedSearchTab: ADVANCED_SEARCH_TABS.ORDER,
        orderDocumentSearchSort: {
          sortColumn: 'formattedFiledDate',
          sortDirection: 'desc',
        },
        opinionDocumentSearchSort: {
          sortColumn: 'formattedFiledDate',
          sortDirection: 'desc',
        },
      },
    });

    expect(result.state.orderDocumentSearchSort.sortColumn).toEqual(
      'numberOfPages',
    );
    expect(result.state.orderDocumentSearchSort.sortDirection).toEqual('asc');
  });

  it('should update opinionDocumentSearchSort when advancedSearchTab is OPINION', async () => {
    const result = await runAction(setDocumentSearchResultsAction, {
      modules: {
        presenter,
      },
      props: {
        sortColumn: 'judge',
        sortDirection: 'desc',
      },
      state: {
        advancedSearchTab: ADVANCED_SEARCH_TABS.OPINION,
        orderDocumentSearchSort: {
          sortColumn: 'formattedFiledDate',
          sortDirection: 'desc',
        },
        opinionDocumentSearchSort: {
          sortColumn: 'formattedFiledDate',
          sortDirection: 'desc',
        },
      },
    });

    expect(result.state.opinionDocumentSearchSort.sortColumn).toEqual('judge');
    expect(result.state.opinionDocumentSearchSort.sortDirection).toEqual(
      'desc',
    );
  });

  it('should update caseSearchSort when advancedSearchTab is CASE and sortColumn is provided', async () => {
    const result = await runAction(setDocumentSearchResultsAction, {
      modules: {
        presenter,
      },
      props: {
        sortColumn: 'docketNumber',
        sortDirection: 'asc',
      },
      state: {
        advancedSearchTab: ADVANCED_SEARCH_TABS.CASE,
        caseSearchSort: {
          sortColumn: undefined,
          sortDirection: undefined,
        },
      },
    });

    expect(result.state.caseSearchSort.sortColumn).toEqual('docketNumber');
    expect(result.state.caseSearchSort.sortDirection).toEqual('asc');
  });

  it('should reset caseSearchSort to undefined when advancedSearchTab is CASE and sort by relevance is selected', async () => {
    const result = await runAction(setDocumentSearchResultsAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        advancedSearchTab: ADVANCED_SEARCH_TABS.CASE,
        caseSearchSort: {
          sortColumn: 'docketNumber',
          sortDirection: 'asc',
        },
      },
    });

    expect(result.state.caseSearchSort.sortColumn).toBeUndefined();
    expect(result.state.caseSearchSort.sortDirection).toBeUndefined();
  });

  it('should do nothing when advancedSearchTab is PRACTITIONER', async () => {
    const result = await runAction(setDocumentSearchResultsAction, {
      modules: {
        presenter,
      },
      props: {
        sortColumn: 'caseTitle',
        sortDirection: 'desc',
      },
      state: {
        advancedSearchTab: ADVANCED_SEARCH_TABS.PRACTITIONER,
        caseSearchSort: {
          sortColumn: undefined,
          sortDirection: undefined,
        },
      },
    });

    expect(result.state.caseSearchSort.sortColumn).toBeUndefined();
    expect(result.state.caseSearchSort.sortDirection).toBeUndefined();
  });
});
