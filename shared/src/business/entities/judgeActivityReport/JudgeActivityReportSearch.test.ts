import { JudgeActivityReportSearch } from './JudgeActivityReportSearch';
import { calculateISODate } from '../../utilities/DateHandler';

describe('JudgeActivityReportSearch', () => {
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
      startDate: '2025-02-01T00:00:00.000Z',
    });

    expect(
      judgeActivityReportSearchEntity.getFormattedValidationErrors(),
    ).toMatchObject({
      endDate: 'Enter an end date.',
    });
  });

  it('should have validation errors when the end date provided is chronologically before the start date', () => {
    const judgeActivityReportSearchEntity = new JudgeActivityReportSearch({
      endDate: '2021-02-01T00:00:00.000Z',
      startDate: '2022-02-01T00:00:00.000Z',
    });

    expect(
      judgeActivityReportSearchEntity.getFormattedValidationErrors(),
    ).toMatchObject({
      endDate:
        'End date cannot be prior to Start Date. Enter a valid End date.',
    });
  });

  it('should have validation errors when the start date provided is in the future', () => {
    const mockFutureDate = calculateISODate({ howMuch: 5, units: 'days' });

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
    const mockFutureDate = calculateISODate({ howMuch: 5, units: 'days' });

    const judgeActivityReportSearchEntity = new JudgeActivityReportSearch({
      endDate: mockFutureDate,
      startDate: '2020-03-01T00:00:00.000Z',
    });

    expect(
      judgeActivityReportSearchEntity.getFormattedValidationErrors(),
    ).toMatchObject({
      endDate: 'End date cannot be in the future. Enter a valid date.',
    });
  });
});
