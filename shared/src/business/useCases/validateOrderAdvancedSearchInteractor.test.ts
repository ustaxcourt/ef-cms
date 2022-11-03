import { DATE_RANGE_SEARCH_OPTIONS } from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { validateOrderAdvancedSearchInteractor } from './validateOrderAdvancedSearchInteractor';

describe('validateOrderAdvancedSearchInteractor', () => {
  it('returns null when no errors exist in the orderSearch', () => {
    const errors = validateOrderAdvancedSearchInteractor(applicationContext, {
      orderSearch: {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword: 'Joe Exotic',
        startDate: '01/01/2001',
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
