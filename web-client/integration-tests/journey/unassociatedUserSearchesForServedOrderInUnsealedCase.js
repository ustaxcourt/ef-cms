import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';

export const unassociatedUserSearchesForServedOrderInUnsealedCase = (
  test,
  options,
) => {
  return it('unassociated user searches for served order in an unsealed case', async () => {
    test.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    test.setState('advancedSearchForm', {
      orderSearch: {
        keyword: options.keyword,
        startDate: '1000-01-01',
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    expect(
      test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId:
            test.draftOrders[options.draftOrderIndex].docketEntryId,
        }),
      ]),
    );
  });
};
