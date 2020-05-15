import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserSearchesForOrderByKeyword = (test, testClient) => {
  return it('Search for order by keyword', async () => {
    await refreshElasticsearchIndex();

    test.setState('advancedSearchForm', {
      orderSearch: {
        orderKeyword: 'osteodontolignikeratic',
      },
    });

    await test.runSequence('submitPublicOrderAdvancedSearchSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('searchResults')).toEqual([]);

    test.setState('advancedSearchForm', {
      orderSearch: {
        orderKeyword: 'dismissed',
      },
    });

    await test.runSequence('submitPublicOrderAdvancedSearchSequence');

    expect(test.getState('searchResults')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentId: testClient.draftOrders[1].documentId,
        }),
      ]),
    );
    expect(test.getState('searchResults')).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentId: testClient.draftOrders[2].documentId,
        }),
      ]),
    );
  });
};
