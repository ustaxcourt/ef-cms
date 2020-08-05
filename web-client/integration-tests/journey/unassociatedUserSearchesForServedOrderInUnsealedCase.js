export const unassociatedUserSearchesForServedOrderInUnsealedCase = (
  test,
  options,
) => {
  return it('unassociated user searches for served order in an unsealed case', async () => {
    test.setState('advancedSearchForm', {
      orderSearch: {
        keyword: options.keyword,
        startDate: '1000-01-01',
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    expect(test.getState('searchResults')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentId: test.draftOrders[options.draftOrderIndex].documentId,
        }),
      ]),
    );
  });
};
