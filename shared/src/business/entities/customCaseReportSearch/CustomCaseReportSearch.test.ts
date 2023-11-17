import { CustomCaseReportSearch } from './CustomCaseReportSearch';
import {
  calculateISODate,
  createISODateString,
} from '../../utilities/DateHandler';

describe('CustomCaseReportSearch', () => {
  const mockFutureDate = calculateISODate({ howMuch: 5, units: 'days' });
  const mockPastDate = calculateISODate({ howMuch: -5, units: 'days' });
  const today = createISODateString();

  describe('Start and End Date', () => {
    it('should have validation errors when the end date provided is chronologically before a valid start date', () => {
      const customCaseReportSearch = new CustomCaseReportSearch({
        endDate: mockPastDate,
        filingMethod: 'all',
        startDate: today,
      });

      expect(
        customCaseReportSearch.getFormattedValidationErrors(),
      ).toMatchObject({
        endDate:
          'End date cannot be prior to start date. Enter a valid end date.',
      });
    });

    it('should have validation errors when the start date provided is in the future and the end date is not submitted', () => {
      const customCaseReportSearch = new CustomCaseReportSearch({
        endDate: undefined,
        startDate: mockFutureDate,
      });

      expect(
        customCaseReportSearch.getFormattedValidationErrors(),
      ).toMatchObject({
        startDate: 'Start date cannot be in the future. Enter a valid date.',
      });
    });

    it('should have validation errors when the end date provided is in the future and the start date is not submitted', () => {
      const customCaseReportSearch = new CustomCaseReportSearch({
        endDate: mockFutureDate,
        startDate: undefined,
      });

      expect(
        customCaseReportSearch.getFormattedValidationErrors(),
      ).toMatchObject({
        endDate: 'End date cannot be in the future. Enter a valid date.',
      });
    });

    it('should have validation errors when the start date or end date provided is invalid', () => {
      const customCaseReportSearch = new CustomCaseReportSearch({
        endDate: 'McDonalds',
        startDate: 'Ring Toss',
      });

      expect(
        customCaseReportSearch.getFormattedValidationErrors(),
      ).toMatchObject({
        endDate: 'Enter date in format MM/DD/YYYY.',
        startDate: 'Enter date in format MM/DD/YYYY.',
      });
    });
  });

  it('should have validation errors when an invalid case type is being searched for', () => {
    const customCaseReportSearch = new CustomCaseReportSearch({
      caseTypes: ['Wait... I am not a case type'],
    });

    expect(
      customCaseReportSearch.getFormattedValidationErrors()?.['caseTypes[0]'],
    ).toBeDefined();
  });

  it('should have validation errors when an invalid case status is being searched for', () => {
    const customCaseReportSearch = new CustomCaseReportSearch({
      caseStatuses: ['Wait... I am not a case status'],
    });

    expect(
      customCaseReportSearch.getFormattedValidationErrors()?.[
        'caseStatuses[0]'
      ],
    ).toBeDefined();
  });

  it('should enforce that pageSize is a number', () => {
    const customCaseReportSearch = new CustomCaseReportSearch({
      pageSize: 'I am string',
    });

    expect(
      customCaseReportSearch.getFormattedValidationErrors()?.pageSize,
    ).toBeDefined();
  });

  it('should not allow filing methods that are not all, paper, nor electronic', () => {
    const customCaseReportSearch = new CustomCaseReportSearch({
      filingMethod: 'I am not a paper',
    });

    expect(
      customCaseReportSearch.getFormattedValidationErrors()?.filingMethod,
    ).toBeDefined();
  });

  it('should allow filing methods that are either all, paper, or electronic', () => {
    const customCaseReportSearch = new CustomCaseReportSearch({
      filingMethod: 'paper',
    });

    expect(
      customCaseReportSearch.getFormattedValidationErrors()?.filingMethod,
    ).toBeUndefined();
  });

  it('should not allow procedure types that are not All, Regular, nor Small', () => {
    const customCaseReportSearch = new CustomCaseReportSearch({
      procedureType: 'Big',
    });

    expect(
      customCaseReportSearch.getFormattedValidationErrors()?.procedureType,
    ).toBeDefined();
  });

  it('should allow procedure types that are either All, Regular, nor Small', () => {
    const customCaseReportSearch = new CustomCaseReportSearch({
      procedureType: 'Regular',
    });

    expect(
      customCaseReportSearch.getFormattedValidationErrors()?.procedureType,
    ).toBeUndefined();
  });

  it('should not allow high priority to be undefined', () => {
    const customCaseReportSearch = new CustomCaseReportSearch({
      procedureType: 'Big',
    });

    expect(
      customCaseReportSearch.getFormattedValidationErrors()?.procedureType,
    ).toBeDefined();
  });

  it('should not have validation errors when searchAfter contains a pk and receivedAt value', () => {
    const customCaseReportSearch = new CustomCaseReportSearch({
      searchAfter: {
        pk: 'case|102-23',
        receivedAt: 12,
      },
    });

    expect(
      customCaseReportSearch.getFormattedValidationErrors()?.searchAfter,
    ).toBeUndefined();
    expect(
      customCaseReportSearch.getFormattedValidationErrors()?.pk,
    ).toBeUndefined();
    expect(
      customCaseReportSearch.getFormattedValidationErrors()?.receivedAt,
    ).toBeUndefined();
  });
});
