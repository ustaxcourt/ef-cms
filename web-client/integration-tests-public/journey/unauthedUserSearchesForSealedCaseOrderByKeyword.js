import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserSearchesForSealedCaseOrderByKeyword = (
  test,
  testClient,
) => {
  return it('Search for sealed case order by keyword', async () => {
    await refreshElasticsearchIndex();

    test.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'dismiss',
      },
    });

    await test.runSequence('submitPublicOrderAdvancedSearchSequence');

    expect(test.getState('searchResults')).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: testClient.draftOrders[1].docketEntryId,
        }),
      ]),
    );
  });
};
