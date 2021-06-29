import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserSearchesForOrderByKeyword = (test, testClient) => {
  return it('Search for order by keyword', async () => {
    await refreshElasticsearchIndex();

    test.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'osteodontolignikeratic',
        startDate: '1000-01-01',
      },
    });

    await test.runSequence('submitPublicOrderAdvancedSearchSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(
      test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).toEqual([]);

    test.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'dismissed',
        startDate: '1000-01-01',
      },
    });

    await test.runSequence('submitPublicOrderAdvancedSearchSequence');

    expect(
      test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: testClient.draftOrders[1].docketEntryId,
        }),
      ]),
    );
    expect(
      test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: testClient.draftOrders[2].docketEntryId,
        }),
      ]),
    );
  });
};
