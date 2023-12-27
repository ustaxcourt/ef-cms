import {
  ADVANCED_SEARCH_TABS,
  DATE_RANGE_SEARCH_OPTIONS,
} from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserSearchesForOrderByKeyword = (
  cerebralTest,
  testClient,
) => {
  return it('Search for order by keyword', async () => {
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);
    await refreshElasticsearchIndex();

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword: 'osteodontolignikeratic',
        startDate: '01/01/1000',
      },
    });

    await cerebralTest.runSequence('submitPublicOrderAdvancedSearchSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).toEqual([]);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword: 'dismissal',
        startDate: '01/01/1000',
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
