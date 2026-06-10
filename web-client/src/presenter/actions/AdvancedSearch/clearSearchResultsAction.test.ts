import {
  ADVANCED_SEARCH_TABS,
  ASCENDING,
  DESCENDING,
} from '@shared/business/entities/EntityConstants';
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

  it('should clear only the case tab searchResults and reset caseSearchSort to No. ascending when tab is CASE', async () => {
    const result = await runAction(clearSearchResultsAction, {
      state: {
        advancedSearchForm: {
          caseSearchByName: { petitionerName: 'Bubbles' },
          currentPage: 5,
        },
        advancedSearchTab: ADVANCED_SEARCH_TABS.CASE,
        caseSearchSort: {
          sortColumn: 'docketNumber',
          sortDirection: ASCENDING,
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
    expect(result.state.caseSearchSort?.sortColumn).toEqual('resultIndex');
    expect(result.state.caseSearchSort?.sortDirection).toEqual(ASCENDING);
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
          sortDirection: ASCENDING,
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
    expect(result.state.orderDocumentSearchSort?.sortDirection).toEqual(
      DESCENDING,
    );
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
          sortDirection: ASCENDING,
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
      DESCENDING,
    );
  });

  it('should not modify sort state for ORDER or OPINION tabs when tab is CASE', async () => {
    const result = await runAction(clearSearchResultsAction, {
      state: {
        advancedSearchForm: { currentPage: 2 },
        advancedSearchTab: ADVANCED_SEARCH_TABS.CASE,
        caseSearchSort: { sortColumn: 'caseTitle', sortDirection: DESCENDING },
        opinionDocumentSearchSort: {
          sortColumn: 'formattedFiledDate',
          sortDirection: DESCENDING,
        },
        orderDocumentSearchSort: {
          sortColumn: 'formattedFiledDate',
          sortDirection: DESCENDING,
        },
        searchResults: { case: [{ docketNumber: '101-20' }] },
      },
    });

    expect(result.state.caseSearchSort?.sortColumn).toEqual('resultIndex');
    expect(result.state.caseSearchSort?.sortDirection).toEqual(ASCENDING);
    expect(result.state.orderDocumentSearchSort?.sortColumn).toEqual(
      'formattedFiledDate',
    );
    expect(result.state.opinionDocumentSearchSort?.sortColumn).toEqual(
      'formattedFiledDate',
    );
  });
});
