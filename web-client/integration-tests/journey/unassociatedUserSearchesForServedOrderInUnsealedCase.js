export const unassociatedUserSearchesForServedOrderInUnsealedCase = (
  test,
  options,
) => {
  return it('unassociated user searches for served order in an unsealed case', async () => {
    test.setState('advancedSearchForm', {
      orderSearch: {
        orderKeyword: options.orderKeyword,
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
