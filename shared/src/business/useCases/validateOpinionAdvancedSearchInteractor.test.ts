import { DATE_RANGE_SEARCH_OPTIONS } from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { validateOpinionAdvancedSearchInteractor } from './validateOpinionAdvancedSearchInteractor';

describe('validateOpinionAdvancedSearchInteractor', () => {
  it('returns null when no errors exist in the opinionSearch', () => {
    const errors = validateOpinionAdvancedSearchInteractor(applicationContext, {
      opinionSearch: {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword: 'Joe Exotic',
        startDate: '10/10/2001',
      },
    });

    expect(errors).toBeNull();
  });

  it('does not return an error when a search term is not provided', () => {
    const errors = validateOpinionAdvancedSearchInteractor(applicationContext, {
      opinionSearch: {
        keyword: '',
      },
    });

    expect(errors).toBeNull();
  });
});
