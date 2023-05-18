import { CustomCaseInventorySearch } from './CustomCaseInventorySearch';
import {
  calculateISODate,
  createISODateString,
} from '../../utilities/DateHandler';

describe('CustomCaseInventorySearch', () => {
  const mockFutureDate = calculateISODate({ howMuch: 5, units: 'days' });
  const mockPastDate = calculateISODate({ howMuch: -5, units: 'days' });
  const today = createISODateString();

  describe('Start and End Date', () => {
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

    it('should have validation errors when the end date provided is chronologically before a valid start date', () => {
      const customCaseInventorySearch = new CustomCaseInventorySearch({
        endDate: mockPastDate,
        filingMethod: 'all',
        startDate: today,
      });

      expect(
        customCaseInventorySearch.getFormattedValidationErrors(),
      ).toMatchObject({
        endDate:
          'End date cannot be prior to start date. Enter a valid end date.',
      });
    });

    it('should have validation errors when the start date provided is in the future and the end date is not submitted', () => {
      const customCaseInventorySearch = new CustomCaseInventorySearch({
        endDate: undefined,
        startDate: mockFutureDate,
      });

      expect(
        customCaseInventorySearch.getFormattedValidationErrors(),
      ).toMatchObject({
        endDate: 'Enter an end date.',
        startDate: 'Start date cannot be in the future. Enter a valid date.',
      });
    });
  });

  it('should have validation errors when an invalid case type is being searched for', () => {
    const customCaseInventorySearch = new CustomCaseInventorySearch({
      caseTypes: ['Wait... I am not a case type'],
    });

    expect(
      customCaseInventorySearch.getFormattedValidationErrors()?.[
        'caseTypes[0]'
      ],
    ).toBeDefined();
  });

  it('should have validation errors when an invalid case status is being searched for', () => {
    const customCaseInventorySearch = new CustomCaseInventorySearch({
      caseStatuses: ['Wait... I am not a case status'],
    });

    expect(
      customCaseInventorySearch.getFormattedValidationErrors()?.[
        'caseStatuses[0]'
      ],
    ).toBeDefined();
  });

  it('should enforce that pageSize is a number', () => {
    const customCaseInventorySearch = new CustomCaseInventorySearch({
      pageSize: 'I am string',
    });

    expect(
      customCaseInventorySearch.getFormattedValidationErrors()?.pageSize,
    ).toBeDefined();
  });

  it('should not allow filing methods that are not all, paper, nor electronic', () => {
    const customCaseInventorySearch = new CustomCaseInventorySearch({
      filingMethod: 'I am not a paper',
    });

    expect(
      customCaseInventorySearch.getFormattedValidationErrors()?.filingMethod,
    ).toBeDefined();
  });

  it('should allow filing methods that are either all, paper, or electronic', () => {
    const customCaseInventorySearch = new CustomCaseInventorySearch({
      filingMethod: 'paper',
    });

    expect(
      customCaseInventorySearch.getFormattedValidationErrors()?.filingMethod,
    ).toBeUndefined();
  });

  it('should not have validation errors when searchAfter contains a pk and receivedAt value', () => {
    const customCaseInventorySearch = new CustomCaseInventorySearch({
      searchAfter: {
        pk: 'case|102-23',
        receivedAt: 12,
      },
    });

    expect(
      customCaseInventorySearch.getFormattedValidationErrors()?.searchAfter,
    ).toBeUndefined();
    expect(
      customCaseInventorySearch.getFormattedValidationErrors()?.pk,
    ).toBeUndefined();
    expect(
      customCaseInventorySearch.getFormattedValidationErrors()?.receivedAt,
    ).toBeUndefined();
  });
});
