import {
  FORMATS,
  calculateISODate,
  formatDateString,
} from '../../utilities/DateHandler';
import { JudgeActivityReportSearch } from './JudgeActivityReportSearch';

describe('JudgeActivityReportSearch', () => {
  describe('validation', () => {
    const mockFutureDate = formatDateString(
      calculateISODate({ howMuch: 5, units: 'days' }),
      FORMATS.MMDDYYYY,
    );

    it('should have validation errors when start date is not provided', () => {
      const judgeActivityReportSearchEntity = new JudgeActivityReportSearch({
        endDate: '01/01/2000',
        startDate: undefined,
      });

      expect(
        judgeActivityReportSearchEntity.getFormattedValidationErrors(),
      ).toMatchObject({
        startDate: 'Enter a start date.',
      });
    });

    it('should have validation errors when end date is not provided', () => {
      const judgeActivityReportSearchEntity = new JudgeActivityReportSearch({
        endDate: undefined,
        startDate: '02/01/2025',
      });

      expect(
        judgeActivityReportSearchEntity.getFormattedValidationErrors(),
      ).toMatchObject({
        endDate: 'Enter an end date.',
      });
    });

    it('should have validation errors when the end date provided is chronologically before the start date', () => {
      const judgeActivityReportSearchEntity = new JudgeActivityReportSearch({
        endDate: '01/01/2021',
        startDate: '02/01/2022',
      });

      expect(
        judgeActivityReportSearchEntity.getFormattedValidationErrors(),
      ).toMatchObject({
        endDate:
          'End date cannot be prior to Start Date. Enter a valid end date.',
      });
    });

    it('should have validation errors when the start date provided is in the future', () => {
      const judgeActivityReportSearchEntity = new JudgeActivityReportSearch({
        endDate: mockFutureDate,
        startDate: mockFutureDate,
      });

      expect(
        judgeActivityReportSearchEntity.getFormattedValidationErrors(),
      ).toMatchObject({
        startDate: 'Start date cannot be in the future. Enter a valid date.',
      });
    });

    it('should have validation errors when the end date provided is in the future', () => {
      const judgeActivityReportSearchEntity = new JudgeActivityReportSearch({
        endDate: mockFutureDate,
        startDate: '03/01/2020',
      });

      expect(
        judgeActivityReportSearchEntity.getFormattedValidationErrors(),
      ).toMatchObject({
        endDate: 'End date cannot be in the future. Enter a valid date.',
      });
    });
  });
});
