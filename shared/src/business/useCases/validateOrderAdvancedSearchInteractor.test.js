const {
  validateOrderAdvancedSearchInteractor,
} = require('./validateOrderAdvancedSearchInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('validateOrderAdvancedSearchInteractor', () => {
  it('returns null when no errors exist in the orderSearch', () => {
    const errors = validateOrderAdvancedSearchInteractor(applicationContext, {
      orderSearch: {
        keyword: 'Joe Exotic',
        startDate: '2001-01-01',
      },
    });

    expect(errors).toBeNull();
  });

  it('returns an error when a search term is not provided', () => {
    const errors = validateOrderAdvancedSearchInteractor(applicationContext, {
      orderSearch: {
        keyword: '',
      },
    });

    expect(errors).toMatchObject({ keyword: 'Enter a keyword or phrase' });
  });
});
