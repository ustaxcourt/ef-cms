import { CAV_AND_SUBMITTED_CASE_STATUS } from '../EntityConstants';
import { JudgeActivityReportStatusSearch } from './JudgeActivityReportStatusSearch';

describe('JudgeActivityReportStatusSearch', () => {
  it('should have validation errors when judgesSelection(s) are not provided', () => {
    const judgeActivityReportSearchEntity = new JudgeActivityReportStatusSearch(
      {
        statuses: CAV_AND_SUBMITTED_CASE_STATUS,
      },
    );

    expect(
      judgeActivityReportSearchEntity.getFormattedValidationErrors(),
    ).toMatchObject({
      judgesSelection: 'Judges Selection is a required field',
    });
  });

  it('should have validation errors when statuses are not provided', () => {
    const judgeActivityReportSearchEntity = new JudgeActivityReportStatusSearch(
      {
        judgesSelection: ['Buch'],
      },
    );

    expect(
      judgeActivityReportSearchEntity.getFormattedValidationErrors(),
    ).toMatchObject({
      statuses: 'CAV and Submitted fields are required',
    });
  });

  it('should have not have validation errors when both judgesSelection and statuses are valid', () => {
    const judgeActivityReportSearchEntity = new JudgeActivityReportStatusSearch(
      {
        judgesSelection: ['Buch'],
        statuses: CAV_AND_SUBMITTED_CASE_STATUS,
      },
    );

    expect(
      judgeActivityReportSearchEntity.getFormattedValidationErrors(),
    ).toEqual(null);
  });
});
