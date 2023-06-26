import {
  CASE_STATUS_TYPES,
  CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
  CAV_AND_SUBMITTED_CASE_STATUS,
} from '../EntityConstants';
import { JudgeActivityReportCaseStatusSearch } from './JudgeActivityReportSearchCaseStatusSearch';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';

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
        judgeName: judgeUser.name,
      });

    expect(
      judgeActivityReportSearchEntity.getFormattedValidationErrors(),
    ).toMatchObject({
      statuses: 'CAV and Submitted fields are required',
    });
  });

  it('should have validation errors when searchAfter is not provided', () => {
    const judgeActivityReportSearchEntity =
      new JudgeActivityReportCaseStatusSearch({
        judgeName: judgeUser.name,
        pageSize: CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
        statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
      });

    expect(
      judgeActivityReportSearchEntity.getFormattedValidationErrors(),
    ).toMatchObject({
      searchAfter: '"searchAfter" is required',
    });
  });

  it('should have validation errors when pageSize is not provided', () => {
    const judgeActivityReportSearchEntity =
      new JudgeActivityReportCaseStatusSearch({
        judgeName: judgeUser.name,
        searchAfter: 3,
        statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
      });

    expect(
      judgeActivityReportSearchEntity.getFormattedValidationErrors(),
    ).toMatchObject({
      pageSize: '"pageSize" is required',
    });
  });

  it('should have not have validation errors when both judgeName and statuses are valid', () => {
    const judgeActivityReportSearchEntity =
      new JudgeActivityReportCaseStatusSearch({
        judgeName: judgeUser.name,
        pageSize: CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
        searchAfter: 3,
        statuses: CAV_AND_SUBMITTED_CASE_STATUS,
      });

    expect(
      judgeActivityReportSearchEntity.getFormattedValidationErrors(),
    ).toEqual(null);
  });
});
