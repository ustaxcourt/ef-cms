export const unassociatedUserSearchesForServedOrderInSealedCase = (
  test,
  options,
) => {
  return it('unassociated user searches for served order in a sealed case', async () => {
    test.setState('advancedSearchForm', {
      orderSearch: {
        orderKeyword: options.orderKeyword,
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    expect(test.getState('searchResults')).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentId: test.draftOrders[options.draftOrderIndex].documentId,
        }),
      ]),
    );
  });
};
