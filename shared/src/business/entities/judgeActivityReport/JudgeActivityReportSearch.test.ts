import {
  FORMATS,
  calculateISODate,
  formatDateString,
} from '../../utilities/DateHandler';
import { JudgeActivityReportSearch } from './JudgeActivityReportSearch';

describe('JudgeActivityReportSearch', () => {
  describe('constructor', () => {
    it('should convert startDate to an ISO datetime representing the beginning of the day, EDT', () => {
      const judgeActivityReportSearchEntity = new JudgeActivityReportSearch({
        endDate: '01/03/2000',
        startDate: '01/01/2000',
      });

      expect(judgeActivityReportSearchEntity.startDate).toEqual(
        '2000-01-01T05:00:00.000Z',
      );
    });

    it('should convert endDate to an ISO datetime representing the end of the day, EDT', () => {
      const judgeActivityReportSearchEntity = new JudgeActivityReportSearch({
        endDate: '01/03/2000',
        startDate: '01/01/2000',
      });

      expect(judgeActivityReportSearchEntity.endDate).toEqual(
        '2000-01-04T04:59:59.999Z',
      );
    });
  });

  describe('validation', () => {
    const mockFutureDate = formatDateString(
      calculateISODate({ howMuch: 5, units: 'days' }),
      FORMATS.MMDDYYYY,
    );

    it('should have validation errors when the end date provided is chronologically before the start date', () => {
      const judgeActivityReportSearchEntity = new JudgeActivityReportSearch({
        endDate: '01/01/2021',
        startDate: '02/01/2022',
      });

      expect(
        judgeActivityReportSearchEntity.getFormattedValidationErrors(),
      ).toMatchObject({
        endDate: 'End date cannot be prior to start date. Enter a valid date.',
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

    it('should have validation errors when the start and/or end dates provided are NOT valid dates', () => {
      const judgeActivityReportSearchEntity = new JudgeActivityReportSearch({
        endDate: '01--01--2000',
        startDate: 'NOTADATE',
      });

      expect(
        judgeActivityReportSearchEntity.getFormattedValidationErrors(),
      ).toMatchObject({
        endDate: 'Enter a valid end date.',
        startDate: 'Enter a valid start date.',
      });
    });
  });
});
