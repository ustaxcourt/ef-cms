import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';

export const unassociatedUserSearchesForServedOrderInUnsealedCase = (
  cerebralTest,
  options,
) => {
  return it('unassociated user searches for served order in an unsealed case', async () => {
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: options.keyword,
        startDate: '1000-01-01',
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
