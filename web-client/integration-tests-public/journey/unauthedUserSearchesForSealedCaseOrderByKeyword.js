import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export default (test, testClient) => {
  return it('Search for sealed case order by keyword', async () => {
    await refreshElasticsearchIndex();

    test.setState('advancedSearchForm', {
      orderSearch: {
        orderKeyword: 'dismiss',
      },
    });

    await test.runSequence('submitPublicOrderAdvancedSearchSequence');

    expect(test.getState('searchResults')).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentId: testClient.draftOrders[1].documentId,
        }),
      ]),
    );
  });
};
