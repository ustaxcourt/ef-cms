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
        createEndDate: today,
        createStartDate: undefined,
      });

      expect(
        customCaseInventorySearch.getFormattedValidationErrors(),
      ).toMatchObject({
        createStartDate: 'Enter a start date.',
      });
    });

    it('should have validation errors when end date is not provided', () => {
      const customCaseInventorySearch = new CustomCaseInventorySearch({
        createEndDate: undefined,
        createStartDate: today,
      });

      expect(
        customCaseInventorySearch.getFormattedValidationErrors(),
      ).toMatchObject({
        createEndDate: 'Enter an end date.',
      });
    });

    it('should have validation errors when the end date provided is chronologically before the start date', () => {
      const customCaseInventorySearch = new CustomCaseInventorySearch({
        createEndDate: mockPastDate,
        createStartDate: today,
      });

      expect(
        customCaseInventorySearch.getFormattedValidationErrors(),
      ).toMatchObject({
        createEndDate:
          'End date cannot be prior to start date. Enter a valid end date.',
      });
    });

    it('should have validation errors when the start date provided is in the future', () => {
      const customCaseInventorySearch = new CustomCaseInventorySearch({
        createEndDate: undefined,
        createStartDate: mockFutureDate,
      });

      expect(
        customCaseInventorySearch.getFormattedValidationErrors(),
      ).toMatchObject({
        createStartDate:
          'Start date cannot be in the future. Enter a valid date.',
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

  it('should enforce that the pageNumber is a number', () => {
    const customCaseInventorySearch = new CustomCaseInventorySearch({
      pageNumber: 'I am string',
    });

    expect(
      customCaseInventorySearch.getFormattedValidationErrors()?.pageNumber,
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
});
