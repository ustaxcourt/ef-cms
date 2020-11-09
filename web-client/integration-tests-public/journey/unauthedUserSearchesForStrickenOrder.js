import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserSearchesForStrickenOrder = test => {
  return it('Unauthed user searches for a stricken order', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoPublicSearchSequence');

    test.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'Order that is stricken',
      },
    });

    await test.runSequence('submitPublicOrderAdvancedSearchSequence');

    expect(test.getState('searchResults')).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentTitle: 'Order that is stricken',
        }),
      ]),
    );
  });
};
