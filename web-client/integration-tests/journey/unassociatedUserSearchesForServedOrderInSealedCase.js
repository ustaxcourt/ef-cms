import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';

export const unassociatedUserSearchesForServedOrderInSealedCase = (
  test,
  options,
) => {
  return it('unassociated user searches for served order in a sealed case', async () => {
    test.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    test.setState('advancedSearchForm', {
      orderSearch: {
        keyword: options.keyword,
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    expect(
      test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId:
            test.draftOrders[options.draftOrderIndex].docketEntryId,
        }),
      ]),
    );
  });
};
