import { wait } from '../../integration-tests/helpers';

export const associatedUserSearchesForServedOrder = (test, options) => {
  return it('associated user searches for served order', async () => {
    test.setState('advancedSearchForm', {
      orderSearch: {
        orderKeyword: options.orderKeyword,
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    await wait(1000);

    expect(test.getState('searchResults')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentId: test.draftOrders[options.draftOrderIndex].documentId,
        }),
      ]),
    );
  });
};
