import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserSearchesForOrderByKeyword = (
  cerebralTest,
  testClient,
) => {
  return it('Search for order by keyword', async () => {
    await refreshElasticsearchIndex();

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'osteodontolignikeratic',
        startDate: '1000-01-01',
      },
    });

    await cerebralTest.runSequence('submitPublicOrderAdvancedSearchSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).toEqual([]);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'dismissed',
        startDate: '1000-01-01',
      },
    });

    await cerebralTest.runSequence('submitPublicOrderAdvancedSearchSequence');

    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: testClient.draftOrders[1].docketEntryId,
        }),
      ]),
    );
    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: testClient.draftOrders[2].docketEntryId,
        }),
      ]),
    );
  });
};
