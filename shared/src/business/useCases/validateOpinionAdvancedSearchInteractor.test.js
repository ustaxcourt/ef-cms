const {
  validateOpinionAdvancedSearchInteractor,
} = require('./validateOpinionAdvancedSearchInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('validateOpinionAdvancedSearchInteractor', () => {
  it('returns null when no errors exist in the opinionSearch', () => {
    const errors = validateOpinionAdvancedSearchInteractor(applicationContext, {
      opinionSearch: {
        keyword: 'Joe Exotic',
        startDate: '2001-10-10',
      },
    });

    expect(errors).toBeNull();
  });

  it('returns an error when a search term is not provided', () => {
    const errors = validateOpinionAdvancedSearchInteractor(applicationContext, {
      opinionSearch: {
        keyword: '',
      },
    });

    expect(errors).toMatchObject({
      keyword: 'Enter a keyword or phrase',
    });
  });
});
