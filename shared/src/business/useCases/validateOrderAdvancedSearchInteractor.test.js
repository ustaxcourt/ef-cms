const {
  validateOrderAdvancedSearchInteractor,
} = require('./validateOrderAdvancedSearchInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { DATE_RANGE_SEARCH_OPTIONS } = require('../entities/EntityConstants');

describe('validateOrderAdvancedSearchInteractor', () => {
  it('returns null when no errors exist in the orderSearch', () => {
    const errors = validateOrderAdvancedSearchInteractor(applicationContext, {
      orderSearch: {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword: 'Joe Exotic',
        startDate: '2001-01-01',
      },
    });

    expect(errors).toBeNull();
  });

  it('does not return an error when a search term is not provided', () => {
    const errors = validateOrderAdvancedSearchInteractor(applicationContext, {
      orderSearch: {
        keyword: '',
      },
    });

    expect(errors).toBeNull();
  });
});
