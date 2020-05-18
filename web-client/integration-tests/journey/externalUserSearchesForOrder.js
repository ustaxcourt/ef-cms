export const externalUserSearchesForOrder = test => {
  return it('external user searches for an order', async () => {
    test.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'onomatopoeia',
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    expect(test.getState('searchResults')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentId: test.draftOrders[0].documentId,
        }),
      ]),
    );
  });
};
