import { OrderSearch } from '../../../shared/src/business/entities/orders/OrderSearch';

export default test => {
  return it('Search for order without a keyword', async () => {
    await test.runSequence('gotoPublicSearchSequence');

    await test.runSequence('submitPublicOrderAdvancedSearchSequence');

    expect(test.getState('validationErrors')).toEqual({
      keyword: OrderSearch.VALIDATION_ERROR_MESSAGES.keyword,
    });
  });
};
