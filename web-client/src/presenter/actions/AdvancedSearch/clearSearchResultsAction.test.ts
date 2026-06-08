import { ADVANCED_SEARCH_TABS } from '@shared/business/entities/EntityConstants';
import { clearSearchResultsAction } from './clearSearchResultsAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearSearchResultsAction', () => {
  it('should clear all searchResults and set advancedSearchForm.currentPage to 1 when no tab is set', async () => {
    const result = await runAction(clearSearchResultsAction, {
      state: {
        advancedSearchForm: {
          caseSearchByName: { petitionerName: 'Bubbles' },
          currentPage: 85,
        },
        searchResults: { case: [{ docketNumber: '101-20' }] },
      },
    });

    expect(result.state.advancedSearchForm.currentPage).toEqual(1);
    expect(result.state.searchResults).toBeUndefined();
  });

  it('should clear only the case tab searchResults and reset caseSearchSort when tab is CASE', async () => {
    const result = await runAction(clearSearchResultsAction, {
      state: {
        advancedSearchForm: {
          caseSearchByName: { petitionerName: 'Bubbles' },
          currentPage: 5,
        },
        advancedSearchTab: ADVANCED_SEARCH_TABS.CASE,
        caseSearchSort: {
          sortColumn: 'docketNumber',
          sortDirection: 'asc',
        },
        searchResults: {
          case: [{ docketNumber: '101-20' }],
          order: [{ docketNumber: '202-21' }],
        },
      },
    });

    expect(result.state.advancedSearchForm.currentPage).toEqual(1);
    expect(result.state.searchResults?.case).toBeUndefined();
    expect(result.state.searchResults?.order).toBeDefined();
    expect(result.state.caseSearchSort?.sortColumn).toBeUndefined();
    expect(result.state.caseSearchSort?.sortDirection).toBeUndefined();
  });

  it('should clear only the order tab searchResults and reset orderDocumentSearchSort when tab is ORDER', async () => {
    const result = await runAction(clearSearchResultsAction, {
      state: {
        advancedSearchForm: {
          currentPage: 3,
        },
        advancedSearchTab: ADVANCED_SEARCH_TABS.ORDER,
        orderDocumentSearchSort: {
          sortColumn: 'someColumn',
          sortDirection: 'asc',
        },
        searchResults: {
          case: [{ docketNumber: '101-20' }],
          order: [{ docketNumber: '202-21' }],
        },
      },
    });

    expect(result.state.advancedSearchForm.currentPage).toEqual(1);
    expect(result.state.searchResults?.order).toBeUndefined();
    expect(result.state.searchResults?.case).toBeDefined();
    expect(result.state.orderDocumentSearchSort?.sortColumn).toEqual(
      'formattedFiledDate',
    );
    expect(result.state.orderDocumentSearchSort?.sortDirection).toEqual('desc');
  });

  it('should clear only the opinion tab searchResults and reset opinionDocumentSearchSort when tab is OPINION', async () => {
    const result = await runAction(clearSearchResultsAction, {
      state: {
        advancedSearchForm: {
          currentPage: 7,
        },
        advancedSearchTab: ADVANCED_SEARCH_TABS.OPINION,
        opinionDocumentSearchSort: {
          sortColumn: 'someColumn',
          sortDirection: 'asc',
        },
        searchResults: {
          case: [{ docketNumber: '101-20' }],
          opinion: [{ docketNumber: '303-22' }],
        },
      },
    });

    expect(result.state.advancedSearchForm.currentPage).toEqual(1);
    expect(result.state.searchResults?.opinion).toBeUndefined();
    expect(result.state.searchResults?.case).toBeDefined();
    expect(result.state.opinionDocumentSearchSort?.sortColumn).toEqual(
      'formattedFiledDate',
    );
    expect(result.state.opinionDocumentSearchSort?.sortDirection).toEqual(
      'desc',
    );
  });

  it('should not modify sort state for ORDER or OPINION tabs when tab is CASE', async () => {
    const result = await runAction(clearSearchResultsAction, {
      state: {
        advancedSearchForm: { currentPage: 2 },
        advancedSearchTab: ADVANCED_SEARCH_TABS.CASE,
        caseSearchSort: { sortColumn: 'caseTitle', sortDirection: 'desc' },
        opinionDocumentSearchSort: {
          sortColumn: 'formattedFiledDate',
          sortDirection: 'desc',
        },
        orderDocumentSearchSort: {
          sortColumn: 'formattedFiledDate',
          sortDirection: 'desc',
        },
        searchResults: { case: [{ docketNumber: '101-20' }] },
      },
    });

    expect(result.state.caseSearchSort?.sortColumn).toBeUndefined();
    expect(result.state.caseSearchSort?.sortDirection).toBeUndefined();
    expect(result.state.orderDocumentSearchSort?.sortColumn).toEqual(
      'formattedFiledDate',
    );
    expect(result.state.opinionDocumentSearchSort?.sortColumn).toEqual(
      'formattedFiledDate',
    );
  });
});
