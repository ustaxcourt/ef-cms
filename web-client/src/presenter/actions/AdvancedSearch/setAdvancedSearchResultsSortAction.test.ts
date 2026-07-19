import {
  ADVANCED_SEARCH_TABS,
  ASCENDING,
  DESCENDING,
} from '@shared/business/entities/EntityConstants';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setAdvancedSearchResultsSortAction } from './setAdvancedSearchResultsSortAction';

describe('setAdvancedSearchResultsSortAction', () => {
  it('should update orderDocumentSearchSort when advancedSearchTab is ORDER', async () => {
    const result = await runAction(setAdvancedSearchResultsSortAction, {
      modules: {
        presenter,
      },
      props: {
        sortColumn: 'numberOfPages',
        sortDirection: ASCENDING,
      },
      state: {
        advancedSearchTab: ADVANCED_SEARCH_TABS.ORDER,
        orderDocumentSearchSort: {
          sortColumn: 'formattedFiledDate',
          sortDirection: DESCENDING,
        },
        opinionDocumentSearchSort: {
          sortColumn: 'formattedFiledDate',
          sortDirection: DESCENDING,
        },
      },
    });

    expect(result.state.orderDocumentSearchSort.sortColumn).toEqual(
      'numberOfPages',
    );
    expect(result.state.orderDocumentSearchSort.sortDirection).toEqual(
      ASCENDING,
    );
  });

  it('should update opinionDocumentSearchSort when advancedSearchTab is OPINION', async () => {
    const result = await runAction(setAdvancedSearchResultsSortAction, {
      modules: {
        presenter,
      },
      props: {
        sortColumn: 'judge',
        sortDirection: DESCENDING,
      },
      state: {
        advancedSearchTab: ADVANCED_SEARCH_TABS.OPINION,
        orderDocumentSearchSort: {
          sortColumn: 'formattedFiledDate',
          sortDirection: DESCENDING,
        },
        opinionDocumentSearchSort: {
          sortColumn: 'formattedFiledDate',
          sortDirection: DESCENDING,
        },
      },
    });

    expect(result.state.opinionDocumentSearchSort.sortColumn).toEqual('judge');
    expect(result.state.opinionDocumentSearchSort.sortDirection).toEqual(
      DESCENDING,
    );
  });

  it('should update caseSearchSort when advancedSearchTab is CASE', async () => {
    const result = await runAction(setAdvancedSearchResultsSortAction, {
      modules: {
        presenter,
      },
      props: {
        sortColumn: 'docketNumber',
        sortDirection: ASCENDING,
      },
      state: {
        advancedSearchTab: ADVANCED_SEARCH_TABS.CASE,
        caseSearchSort: {
          sortColumn: 'resultIndex',
          sortDirection: ASCENDING,
        },
      },
    });

    expect(result.state.caseSearchSort.sortColumn).toEqual('docketNumber');
    expect(result.state.caseSearchSort.sortDirection).toEqual(ASCENDING);
  });

  it('should not modify caseSearchSort when advancedSearchTab is PRACTITIONER', async () => {
    const result = await runAction(setAdvancedSearchResultsSortAction, {
      modules: {
        presenter,
      },
      props: {
        sortColumn: 'caseTitle',
        sortDirection: DESCENDING,
      },
      state: {
        advancedSearchTab: ADVANCED_SEARCH_TABS.PRACTITIONER,
        caseSearchSort: {
          sortColumn: 'resultIndex',
          sortDirection: ASCENDING,
        },
      },
    });

    expect(result.state.caseSearchSort.sortColumn).toEqual('resultIndex');
    expect(result.state.caseSearchSort.sortDirection).toEqual(ASCENDING);
  });
});
