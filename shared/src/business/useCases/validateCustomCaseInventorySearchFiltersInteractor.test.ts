import { applicationContext } from '../test/createTestApplicationContext';
import {
  calculateISODate,
  createISODateString,
} from '../utilities/DateHandler';
import { validateCustomCaseInventorySearchFiltersInteractor } from './validateCustomCaseInventorySearchFiltersInteractor';

describe('validateCustomCaseInventorySearchFiltersInteractor', () => {
  const today = createISODateString();
  const mockFutureDate = calculateISODate({ howMuch: 5, units: 'days' });

  it('should return formatted validation errors when the end date and search dates are not defined', () => {
    const errors = validateCustomCaseInventorySearchFiltersInteractor(
      applicationContext,
      {
        endDate: undefined as any,
        startDate: undefined as any,
      },
    );

    expect(errors).toMatchObject({
      endDate: 'Enter an end date.',
      startDate: 'Enter a start date.',
    });
  });

  it('should return null when the search criteria are valid', () => {
    const result = validateCustomCaseInventorySearchFiltersInteractor(
      applicationContext,
      {
        endDate: mockFutureDate,
        startDate: today,
      },
    );

    expect(result).toEqual(null);
  });
});
