import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserSearchesForStrickenOrder = cerebralTest => {
  return it('Unauthed user searches for a stricken order', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoPublicSearchSequence');

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'Order that is stricken',
      },
    });

    await cerebralTest.runSequence('submitPublicOrderAdvancedSearchSequence');

    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentTitle: 'Order that is stricken',
        }),
      ]),
    );
  });
};
