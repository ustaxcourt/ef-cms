import { OrderSearch } from '../../../shared/src/business/entities/orders/OrderSearch';

export const unauthedUserInvalidSearchForOrder = test => {
  return it('Search for order without a keyword', async () => {
    await test.runSequence('gotoPublicSearchSequence');

    await test.runSequence('submitPublicOrderAdvancedSearchSequence');

    expect(test.getState('validationErrors')).toEqual({
      orderKeyword: OrderSearch.VALIDATION_ERROR_MESSAGES.orderKeyword,
    });
  });
};
