import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';

export const externalUserSearchesForOrder = cerebralTest => {
  return it('external user searches for an order', async () => {
    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'onomatopoeia',
      },
    });

    await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[0].docketEntryId,
        }),
      ]),
    );
  });
};
