import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';

export const unassociatedUserSearchesForServedOrderInSealedCase = (
  cerebralTest,
  options,
) => {
  return it('unassociated user searches for served order in a sealed case', async () => {
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: options.keyword,
      },
    });

    await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId:
            cerebralTest.draftOrders[options.draftOrderIndex].docketEntryId,
        }),
      ]),
    );
  });
};
