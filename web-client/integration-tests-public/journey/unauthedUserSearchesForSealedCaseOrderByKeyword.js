import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserSearchesForSealedCaseOrderByKeyword = (
  cerebralTest,
  testClient,
) => {
  return it('Search for sealed case order by keyword', async () => {
    await refreshElasticsearchIndex();

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'dismiss',
      },
    });

    await cerebralTest.runSequence('submitPublicOrderAdvancedSearchSequence');

    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: testClient.draftOrders[1].docketEntryId,
        }),
      ]),
    );
  });
};
