import { CustomCaseInventorySearch } from './CustomCaseInventorySearch';
import {
  calculateISODate,
  createISODateString,
} from '../../utilities/DateHandler';

describe('CustomCaseInventorySearch', () => {
  const mockFutureDate = calculateISODate({ howMuch: 5, units: 'days' });
  const mockPastDate = calculateISODate({ howMuch: -5, units: 'days' });
  const today = createISODateString();

  it('should have validation errors when start date is not provided', () => {
    const customCaseInventorySearch = new CustomCaseInventorySearch({
      endDate: today,
      startDate: undefined,
    });

    expect(
      customCaseInventorySearch.getFormattedValidationErrors(),
    ).toMatchObject({
      startDate: 'Enter a start date.',
    });
  });

  it('should have validation errors when end date is not provided', () => {
    const customCaseInventorySearch = new CustomCaseInventorySearch({
      endDate: undefined,
      startDate: today,
    });

    expect(
      customCaseInventorySearch.getFormattedValidationErrors(),
    ).toMatchObject({
      endDate: 'Enter an end date.',
    });
  });

  it('should have validation errors when the end date provided is chronologically before the start date', () => {
    const customCaseInventorySearch = new CustomCaseInventorySearch({
      endDate: mockPastDate,
      startDate: today,
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
      endDate: undefined,
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
