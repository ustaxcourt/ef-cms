import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';

export const associatedUserSearchesForServedOrder = (
  test,
  options,
  sealed = false,
) => {
  return it('associated user searches for served order', async () => {
    test.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);
    test.setState('advancedSearchForm', {
      orderSearch: {
        keyword: options.keyword,
        startDate: '1000-01-01',
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    if (sealed) {
      expect(
        test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual([]);
    } else {
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
    }
  });
};
