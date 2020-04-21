const {
  validateOrderAdvancedSearchInteractor,
} = require('./validateOrderAdvancedSearchInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('validateOrderAdvancedSearchInteractor', () => {
  it('returns null when no errors exist in the orderSearch', () => {
    const errors = validateOrderAdvancedSearchInteractor({
      applicationContext,
      orderSearch: {
        orderKeyword: 'Joe Exotic',
      },
    });

    expect(errors).toBeNull();
  });

  it('returns an error when a search term is not provided', () => {
    const errors = validateOrderAdvancedSearchInteractor({
      applicationContext,
      orderSearch: {
        orderKeyword: '',
      },
    });

    expect(errors).toMatchObject({ orderKeyword: 'Enter a keyword or phrase' });
  });
});
