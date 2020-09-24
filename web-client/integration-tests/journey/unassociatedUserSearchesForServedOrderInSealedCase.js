export const unassociatedUserSearchesForServedOrderInSealedCase = (
  test,
  options,
) => {
  return it('unassociated user searches for served order in a sealed case', async () => {
    test.setState('advancedSearchForm', {
      orderSearch: {
        keyword: options.keyword,
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    expect(test.getState('searchResults')).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId:
            test.draftOrders[options.draftOrderIndex].docketEntryId,
        }),
      ]),
    );
  });
};
