export const associatedUserSearchesForServedOrder = (test, options) => {
  return it('associated user searches for served order', async () => {
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
