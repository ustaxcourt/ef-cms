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
    const orderSearch = new OrderSearch();
    const validationErrors = orderSearch.getFormattedValidationErrors();

    expect(validationErrors.orderKeyword).toEqual(errorMessages.orderKeyword);
  });

  it('fails validation when both caseTitle and docketNumber are provided as search terms', () => {
    const orderSearch = new OrderSearch({
      caseTitleOrPetitioner: 'Sam Jackson',
      docketNumber: '123-45',
      orderKeyword: 'sunglasses',
    });

    const validationErrors = orderSearch.getFormattedValidationErrors();

    expect(validationErrors.chooseOneValue).toEqual(
      errorMessages.chooseOneValue,
    );
  });
});
