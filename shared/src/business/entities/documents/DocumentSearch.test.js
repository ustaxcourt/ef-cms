const { DocumentSearch } = require('./DocumentSearch');

const errorMessages = DocumentSearch.VALIDATION_ERROR_MESSAGES;

describe('Document Search entity', () => {
  it('needs only a keyword to be valid', () => {
    const opinionSearch = new DocumentSearch({ keyword: 'Notice' });
    expect(opinionSearch).toMatchObject({
      keyword: 'Notice',
    });
    const validationErrors = opinionSearch.getFormattedValidationErrors();
    expect(validationErrors).toEqual(null);
  });

  it('fails validation without a keyword', () => {
    const orderSearch = new DocumentSearch();
    const validationErrors = orderSearch.getFormattedValidationErrors();

    expect(validationErrors.keyword).toEqual(errorMessages.keyword);
  });

  it('fails validation when both caseTitle and docketNumber are provided as search terms', () => {
    const documentSearch = new DocumentSearch({
      caseTitleOrPetitioner: 'Sam Jackson',
      docketNumber: '123-45',
      keyword: 'sunglasses',
    });

    const validationErrors = documentSearch.getFormattedValidationErrors();

    expect(validationErrors.chooseOneValue).toEqual(
      errorMessages.chooseOneValue,
    );
  });

  it('should pass validation when judge provided is empty', () => {
    const documentSearch = new DocumentSearch({
      judge: '',
      keyword: 'sunglasses',
    });

    const validationErrors = documentSearch.getFormattedValidationErrors();

    expect(documentSearch.judge).toBeUndefined();
    expect(validationErrors).toBeNull();
  });

  it('should pass validation when judge is provided', () => {
    const documentSearch = new DocumentSearch({
      judge: 'Guy Fieri',
      keyword: 'sunglasses',
    });

    const validationErrors = documentSearch.getFormattedValidationErrors();

    expect(documentSearch.judge).toBeDefined();
    expect(validationErrors).toBeNull();
  });

  describe('date search validation', () => {
    it('should not validate end date and start date when no date range is provided', () => {
      const documentSearch = new DocumentSearch({
        keyword: 'sunglasses',
      });

      const validationErrors = documentSearch.getFormattedValidationErrors();

      expect(validationErrors).toBeNull();
    });

    it('should fail validation when the start date is greater than the end date', () => {
      const documentSearch = new DocumentSearch({
        endDateDay: '2',
        endDateMonth: '10',
        endDateYear: '2020',
        keyword: 'sunglasses',
        startDateDay: '10',
        startDateMonth: '10',
        startDateYear: '2020',
      });

      const validationErrors = documentSearch.getFormattedValidationErrors();

      expect(validationErrors.endDate).toEqual('Enter a valid end date');
    });

    it('should pass validation when a start date is provided without an end date', () => {
      const documentSearch = new DocumentSearch({
        keyword: 'sunglasses',
        startDateDay: '2',
        startDateMonth: '2',
        startDateYear: '2020',
      });

      const validationErrors = documentSearch.getFormattedValidationErrors();

      expect(validationErrors).toBeNull();
    });

    it('should fail validation when an end date is provided without a start date', () => {
      const documentSearch = new DocumentSearch({
        endDateDay: '02',
        endDateMonth: '10',
        endDateYear: '2020',
        keyword: 'sunglasses',
      });

      const validationErrors = documentSearch.getFormattedValidationErrors();

      expect(validationErrors.startDate).toEqual('Enter a valid start date');
    });

    it('should fail validation when the end date year is not provided', () => {
      const documentSearch = new DocumentSearch({
        endDateDay: '12',
        endDateMonth: '10',
        keyword: 'sunglasses',
        startDateDay: '10',
        startDateMonth: '10',
        startDateYear: '2020',
      });

      const validationErrors = documentSearch.getFormattedValidationErrors();

      expect(validationErrors.endDate).toEqual('Enter a valid end date');
    });

    it('should fail validation when the start date year is not provided', () => {
      const documentSearch = new DocumentSearch({
        keyword: 'sunglasses',
        startDateDay: '10',
        startDateMonth: '10',
      });

      const validationErrors = documentSearch.getFormattedValidationErrors();

      expect(validationErrors.startDate).toEqual('Enter a valid start date');
    });

    it('should fail validation when the start date is in the future', () => {
      const documentSearch = new DocumentSearch({
        keyword: 'sunglasses',
        startDateDay: '10',
        startDateMonth: '10',
        startDateYear: '3000',
      });

      const validationErrors = documentSearch.getFormattedValidationErrors();

      expect(validationErrors.startDate).toEqual('Enter a valid start date');
    });

    it('should fail validation when the end date is in the future', () => {
      const documentSearch = new DocumentSearch({
        endDateDay: '20',
        endDateMonth: '20',
        endDateYear: '3000',
        keyword: 'sunglasses',
        startDateDay: '10',
        startDateMonth: '10',
        startDateYear: '2000',
      });

      const validationErrors = documentSearch.getFormattedValidationErrors();

      expect(validationErrors.endDate).toEqual('Enter a valid end date');
    });
  });
});
