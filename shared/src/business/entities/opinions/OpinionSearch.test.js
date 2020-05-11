const { OpinionSearch } = require('./OpinionSearch');

const errorMessages = OpinionSearch.VALIDATION_ERROR_MESSAGES;

describe('Order Search entity', () => {
  it('needs only an order keyword to be valid', () => {
    const opinionSearch = new OpinionSearch({ opinionKeyword: 'Notice' });
    expect(opinionSearch).toMatchObject({
      opinionKeyword: 'Notice',
    });
    const validationErrors = opinionSearch.getFormattedValidationErrors();
    expect(validationErrors).toEqual(null);
  });

  it('fails validation without an order keyword name', () => {
    const opinionSearch = new OpinionSearch();
    const validationErrors = opinionSearch.getFormattedValidationErrors();

    expect(validationErrors.opinionKeyword).toEqual(
      errorMessages.opinionKeyword,
    );
  });
});
