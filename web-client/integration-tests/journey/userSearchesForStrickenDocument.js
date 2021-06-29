import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../helpers';

export const userSearchesForStrickenDocument = test => {
  return it('User searches for a stricken order', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoAdvancedSearchSequence');

    test.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'Order that is stricken',
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    expect(
      test.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentTitle: 'Order that is stricken',
        }),
      ]),
    );
  });
};
