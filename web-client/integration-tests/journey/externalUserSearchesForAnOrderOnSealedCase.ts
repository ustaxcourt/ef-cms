import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../helpers';

export const externalUserSearchesForAnOrderOnSealedCase = cerebralTest => {
  return it('external user searches for an order on sealed case', async () => {
    cerebralTest.setState('searchResults', []);
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoAdvancedSearchSequence');

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'Order for a sealed case',
      },
    });

    await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentTitle: 'Order for a sealed case',
        }),
      ]),
    );
  });
};
