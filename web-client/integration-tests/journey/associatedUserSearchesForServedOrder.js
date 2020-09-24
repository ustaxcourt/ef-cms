export const associatedUserSearchesForServedOrder = (test, options) => {
  return it('associated user searches for served order', async () => {
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
          docketEntryId:
            test.draftOrders[options.draftOrderIndex].docketEntryId,
        }),
      ]),
    );
  });
};
