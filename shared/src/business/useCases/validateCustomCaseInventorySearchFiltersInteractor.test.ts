import { applicationContext } from '../../test/createTestApplicationContext';
import { validateCustomCaseInventorySearchFiltersInteractor } from './validateCustomCaseInventorySearchFiltersInteractor';

describe('validateCustomCaseInventorySearchFiltersInteractor', () => {
  it('should return formatted validation errors when the end date and search dates are not defined', () => {
    const errors = validateCustomCaseInventorySearchFiltersInteractor(
      applicationContext,
      {
        endDate: undefined,
        startDate: undefined,
      },
    );

    expect(errors).toMatchObject({
      endDate: 'Enter a valid end date.',
      startDate: 'Enter a valid start date.',
    });
  });

  it('should return null when the search criteria are valid', () => {
    const result = validateCustomCaseInventorySearchFiltersInteractor(
      applicationContext,
      {
        endDate: '2021-01-23',
        startDate: '2021-01-22',
      },
    );

    expect(result).toEqual(null);
  });
});
