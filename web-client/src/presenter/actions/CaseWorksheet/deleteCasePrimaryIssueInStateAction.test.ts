import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { deleteCasePrimaryIssueInStateAction } from './deleteCasePrimaryIssueInStateAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('deleteCasePrimaryIssueInStateAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const TEST_DOCKET_NUMBER = '999-99';

  it('should set props.casesClosedByJudge on state', async () => {
    const submittedAndCavCasesByJudge = [
      { docketNumber: '1', primaryIssue: 'primaryIssue1' },
      { docketNumber: TEST_DOCKET_NUMBER, primaryIssue: 'primaryIssue2' },
      { docketNumber: '3', primaryIssue: 'primaryIssue2' },
    ];
    const { state } = await runAction(
      deleteCasePrimaryIssueInStateAction as any,
      {
        modules: {
          presenter,
        },
        props: {
          docketNumber: TEST_DOCKET_NUMBER,
        },
        state: {
          judgeActivityReportData: {
            submittedAndCavCasesByJudge,
          },
        },
      },
    );

    const expectedResults = [
      { docketNumber: '1', primaryIssue: 'primaryIssue1' },
      { docketNumber: TEST_DOCKET_NUMBER, primaryIssue: null },
      { docketNumber: '3', primaryIssue: 'primaryIssue2' },
    ];
    expect(
      state.judgeActivityReportData.submittedAndCavCasesByJudge,
    ).toMatchObject(expectedResults);
  });
});
