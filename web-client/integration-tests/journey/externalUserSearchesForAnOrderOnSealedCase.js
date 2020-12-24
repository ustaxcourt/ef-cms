import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../helpers';

export const externalUserSearchesForAnOrderOnSealedCase = test => {
  return it('external user searches for an order on sealed case', async () => {
    test.setState('searchResults', []);
    await refreshElasticsearchIndex();

    await test.runSequence('gotoAdvancedSearchSequence');

    test.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'Order for a sealed case',
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    expect(
      test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentTitle: 'Order for a sealed case',
        }),
      ]),
    );
  });
};
