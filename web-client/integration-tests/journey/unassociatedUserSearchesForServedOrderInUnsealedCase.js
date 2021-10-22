import {
  ADVANCED_SEARCH_TABS,
  DATE_RANGE_SEARCH_OPTIONS,
} from '../../../shared/src/business/entities/EntityConstants';

export const unassociatedUserSearchesForServedOrderInUnsealedCase = (
  cerebralTest,
  options,
) => {
  return it('unassociated user searches for served order in an unsealed case', async () => {
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword: options.keyword,
        startDate: '01/01/1000',
      },
    });

    await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId:
            cerebralTest.draftOrders[options.draftOrderIndex].docketEntryId,
        }),
      ]),
    );
  });
};
