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

  it('should not validate end date ad start date when no date range is provided', () => {
    const orderSearch = new OrderSearch({
      orderKeyword: 'sunglasses',
    });

    const validationErrors = orderSearch.getFormattedValidationErrors();

    expect(validationErrors).toBeNull();
  });

  it('fails validation when the start date is greater than the end date', () => {
    const orderSearch = new OrderSearch({
      endDateDay: '2',
      endDateMonth: '10',
      endDateYear: '2020',
      orderKeyword: 'sunglasses',
      stateDateDay: '10',
      stateDateMonth: '10',
      stateDateYear: '2020',
    });

    const validationErrors = orderSearch.getFormattedValidationErrors();

    expect(validationErrors.endDate).toEqual('Enter a valid date range');
  });

  it('fails validation when the there is a start date and no end date', () => {
    const orderSearch = new OrderSearch({
      orderKeyword: 'sunglasses',
      startDateDay: '2',
      startDateMonth: '10',
      startDateYear: '2020',
    });

    const validationErrors = orderSearch.getFormattedValidationErrors();

    expect(validationErrors.dateRangeRequired).toEqual(
      'Please provide a start and end date',
    );
  });

  it('fails validation when the end date year is not provided', () => {
    const orderSearch = new OrderSearch({
      endDateDay: '12',
      endDateMonth: '10',
      orderKeyword: 'sunglasses',
      startDateYear: '2020',
      stateDateDay: '10',
      stateDateMonth: '10',
    });

    const validationErrors = orderSearch.getFormattedValidationErrors();

    expect(validationErrors.endDate).toEqual('Enter a valid date range');
  });
});
