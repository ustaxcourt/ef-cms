import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDocumentSearchResultsAction } from './setDocumentSearchResultsAction';

describe('setDocumentSearchResultsAction', () => {
  it('sets the sortColumn and sortDirection on the documentSearchSort state', async () => {
    const result = await runAction(setDocumentSearchResultsAction, {
      modules: {
        presenter,
      },
      state: {
        documentSearchSort: {
          sortColumn: 'formattedFiledDate',
          sortDirection: 'desc',
        },
      },
      props: {
        sortColumn: 'numberOfPages',
        sortDirection: 'asc',
      },
    });

    expect(result.state.documentSearchSort.sortColumn).toEqual('numberOfPages');
    expect(result.state.documentSearchSort.sortDirection).toEqual('asc');
  });
});
