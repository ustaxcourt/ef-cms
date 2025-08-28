import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDocumentSearchResultsAction } from './setDocumentSearchResultsAction';
import { ADVANCED_SEARCH_TABS } from '@shared/business/entities/EntityConstants';

describe('setDocumentSearchResultsAction', () => {
  it('updates orderDocumentSearchSort when advancedSearchTab is ORDER', async () => {
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

  it('updates opinionDocumentSearchSort when advancedSearchTab is OPINION', async () => {
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
});
