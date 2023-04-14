import { CustomCaseInventorySearch } from './CustomCaseInventorySearch';
import {
  FORMATS,
  calculateISODate,
  formatDateString,
} from '../../utilities/DateHandler';

describe('CustomCaseInventorySearch', () => {
  const mockFutureDate = formatDateString(
    calculateISODate({ howMuch: 5, units: 'days' }),
    FORMATS.YYYYMMDD,
  );

  it('should have validation errors when start date is not provided', () => {
    const customCaseInventorySearch = new CustomCaseInventorySearch({
      endDate: '2000/01/01',
      startDate: undefined,
    });

    expect(
      customCaseInventorySearch.getFormattedValidationErrors(),
    ).toMatchObject({
      startDate: 'Enter a valid start date.',
    });
  });

  it('should have validation errors when end date is not provided', () => {
    const customCaseInventorySearch = new CustomCaseInventorySearch({
      endDate: undefined,
      startDate: '2025-02-01',
    });

    expect(
      customCaseInventorySearch.getFormattedValidationErrors(),
    ).toMatchObject({
      endDate: 'Enter a valid end date.',
    });
  });

  it('should have validation errors when the end date provided is chronologically before the start date', () => {
    const customCaseInventorySearch = new CustomCaseInventorySearch({
      endDate: '2021-01-01',
      startDate: '2022-02-01',
    });

    expect(
      customCaseInventorySearch.getFormattedValidationErrors(),
    ).toMatchObject({
      endDate:
        'End date cannot be prior to start date. Enter a valid end date.',
    });
  });

  it('should have validation errors when the start date provided is in the future', () => {
    const customCaseInventorySearch = new CustomCaseInventorySearch({
      endDate: mockFutureDate,
      startDate: mockFutureDate,
    });

    expect(
      customCaseInventorySearch.getFormattedValidationErrors(),
    ).toMatchObject({
      startDate: 'Start date cannot be in the future. Enter a valid date.',
    });
  });

  // TODO: Decide if we need to restrict end date to future dates
  it.skip('should have validation errors when the end date provided is in the future', () => {
    const customCaseInventorySearch = new CustomCaseInventorySearch({
      endDate: mockFutureDate,
      startDate: '2020-03-01',
    });

    expect(
      customCaseInventorySearch.getFormattedValidationErrors(),
    ).toMatchObject({
      endDate: 'End date cannot be in the future. Enter a valid date.',
    });
  });
});
