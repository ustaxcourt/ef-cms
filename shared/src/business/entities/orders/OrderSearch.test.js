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

  it('should pass validation when judge provided is empty', () => {
    const orderSearch = new OrderSearch({
      judge: '',
      orderKeyword: 'sunglasses',
    });

    const validationErrors = orderSearch.getFormattedValidationErrors();

    expect(orderSearch.judge).toBeUndefined();
    expect(validationErrors).toBeNull();
  });

  describe('date search validation', () => {
    it('should not validate end date and start date when no date range is provided', () => {
      const orderSearch = new OrderSearch({
        orderKeyword: 'sunglasses',
      });

      const validationErrors = orderSearch.getFormattedValidationErrors();

      expect(validationErrors).toBeNull();
    });

    it('should fail validation when the start date is greater than the end date', () => {
      const orderSearch = new OrderSearch({
        endDateDay: '2',
        endDateMonth: '10',
        endDateYear: '2020',
        orderKeyword: 'sunglasses',
        startDateDay: '10',
        startDateMonth: '10',
        startDateYear: '2020',
      });

      const validationErrors = orderSearch.getFormattedValidationErrors();

      expect(validationErrors.endDate).toEqual('Enter a valid end date');
    });

    it('should pass validation when a start date is provided without an end date', () => {
      const orderSearch = new OrderSearch({
        orderKeyword: 'sunglasses',
        startDateDay: '2',
        startDateMonth: '2',
        startDateYear: '2020',
      });

      const validationErrors = orderSearch.getValidationErrors();

      expect(validationErrors).toBeNull();
    });

    it('should fail validation when an end date is provided without a start date', () => {
      const orderSearch = new OrderSearch({
        endDateDay: '02',
        endDateMonth: '10',
        endDateYear: '2020',
        orderKeyword: 'sunglasses',
      });

      const validationErrors = orderSearch.getFormattedValidationErrors();

      expect(validationErrors.startDate).toEqual('Enter a valid start date');
    });

    it('should fail validation when the end date year is not provided', () => {
      const orderSearch = new OrderSearch({
        endDateDay: '12',
        endDateMonth: '10',
        orderKeyword: 'sunglasses',
        startDateDay: '10',
        startDateMonth: '10',
        startDateYear: '2020',
      });

      const validationErrors = orderSearch.getFormattedValidationErrors();

      expect(validationErrors.endDate).toEqual('Enter a valid end date');
    });

    it('should fail validation when the start date year is not provided', () => {
      const orderSearch = new OrderSearch({
        orderKeyword: 'sunglasses',
        startDateDay: '10',
        startDateMonth: '10',
      });

      const validationErrors = orderSearch.getFormattedValidationErrors();

      expect(validationErrors.startDate).toEqual('Enter a valid start date');
    });

    it('should fail validation when the start date is in the future', () => {
      const orderSearch = new OrderSearch({
        orderKeyword: 'sunglasses',
        startDateDay: '10',
        startDateMonth: '10',
        startDateYear: '3000',
      });

      const validationErrors = orderSearch.getFormattedValidationErrors();

      expect(validationErrors.startDate).toEqual('Enter a valid start date');
    });

    it('should fail validation when the end date is in the future', () => {
      const orderSearch = new OrderSearch({
        endDateDay: '20',
        endDateMonth: '20',
        endDateYear: '3000',
        orderKeyword: 'sunglasses',
        startDateDay: '10',
        startDateMonth: '10',
        startDateYear: '2000',
      });

      const validationErrors = orderSearch.getFormattedValidationErrors();

      expect(validationErrors.endDate).toEqual('Enter a valid end date');
    });
  });
});
