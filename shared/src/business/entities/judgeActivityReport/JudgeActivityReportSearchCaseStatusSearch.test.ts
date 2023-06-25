import { CAV_AND_SUBMITTED_CASE_STATUS } from '../EntityConstants';
import { JudgeActivityReportCaseStatusSearch } from './JudgeActivityReportSearchCaseStatusSearch';

describe('JudgeActivityReportCaseStatusSearch', () => {
  it('should have validation errors when a judges name is not provided', () => {
    const judgeActivityReportSearchEntity =
      new JudgeActivityReportCaseStatusSearch({
        statuses: CAV_AND_SUBMITTED_CASE_STATUS,
      });

    expect(
      judgeActivityReportSearchEntity.getFormattedValidationErrors(),
    ).toMatchObject({
      judgeName: 'Judge name is a required field',
    });
  });

  it('should have validation errors when statuses are not provided', () => {
    const judgeActivityReportSearchEntity =
      new JudgeActivityReportCaseStatusSearch({
        judgeName: 'Buch',
      });

    expect(
      judgeActivityReportSearchEntity.getFormattedValidationErrors(),
    ).toMatchObject({
      statuses: 'CAV and Submitted fields are required',
    });
  });

  it('should have not have validation errors when both judgeName and statuses are valid', () => {
    const judgeActivityReportSearchEntity =
      new JudgeActivityReportCaseStatusSearch({
        judgeName: 'Buch',
        statuses: CAV_AND_SUBMITTED_CASE_STATUS,
      });

    expect(
      judgeActivityReportSearchEntity.getFormattedValidationErrors(),
    ).toEqual(null);
  });
});
