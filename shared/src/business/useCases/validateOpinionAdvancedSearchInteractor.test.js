const {
  validateOpinionAdvancedSearchInteractor,
} = require('./validateOpinionAdvancedSearchInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('validateOpinionAdvancedSearchInteractor', () => {
  it('returns null when no errors exist in the orderSearch', () => {
    const errors = validateOpinionAdvancedSearchInteractor({
      applicationContext,
      opinionSearch: {
        opinionKeyword: 'Joe Exotic',
      },
    });

    expect(errors).toBeNull();
  });

  it('returns an error when a search term is not provided', () => {
    const errors = validateOpinionAdvancedSearchInteractor({
      applicationContext,
      opinionSearch: {
        opinionKeyword: '',
      },
    });

    expect(errors).toMatchObject({
      opinionKeyword: 'Enter a keyword',
    });
  });
});
