import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserSearchesForSealedCaseOrderByKeyword = (
  test,
  testClient,
) => {
  return it('Search for sealed case order by keyword', async () => {
    await refreshElasticsearchIndex();

    test.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'dismiss',
      },
    });

    await test.runSequence('submitPublicOrderAdvancedSearchSequence');

    expect(
      test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: testClient.draftOrders[1].docketEntryId,
        }),
      ]),
    );
  });
};
