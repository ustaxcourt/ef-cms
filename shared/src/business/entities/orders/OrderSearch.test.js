const { OrderSearch } = require('./OrderSearch');

const errorMessages = OrderSearch.VALIDATION_ERROR_MESSAGES;

describe('Order Search entity', () => {
  it('needs only an order keyword to be valid', () => {
    const orderSearch = new OrderSearch({ orderKeyword: 'Notice' });
    expect(orderSearch).toMatchObject({
      orderKeyword: 'Notice',
    });
    const validationErrors = orderSearch.getFormattedValidationErrors();
    expect(validationErrors).toEqual(null);
  });

  it('fails validation without an order keyword name', () => {
    const orderSearch = new OrderSearch({});
    const validationErrors = orderSearch.getFormattedValidationErrors();

    expect(validationErrors.orderKeyword).toEqual(errorMessages.orderKeyword);
  });
});
