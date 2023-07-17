import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateCasePrimaryIssueInStateAction } from './updateCasePrimaryIssueInStateAction';

describe('updateCasePrimaryIssueInStateAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const TEST_DOCKET_NUMBER = '999-99';
  const TEST_PRIMARY_ISSUE = 'SOME TEST PRIMARY ISSUE';

  it("should update the correct case's primary issue in state", async () => {
    const { state } = await runAction(
      updateCasePrimaryIssueInStateAction as any,
      {
        modules: {
          presenter,
        },
        props: {
          docketNumber: TEST_DOCKET_NUMBER,
          primaryIssue: TEST_PRIMARY_ISSUE,
        },
        state: {
          judgeActivityReportData: {
            submittedAndCavCasesByJudge: [
              { docketNumber: 'docketNumber1', primaryIssue: 'primaryIssue1' },
              {
                docketNumber: TEST_DOCKET_NUMBER,
                primaryIssue: 'INITIAL PRIMARY ISSUE',
              },
              { docketNumber: 'docketNumber3', primaryIssue: 'primaryIssue3' },
            ],
          },
        },
      },
    );

    const expectedStateResults = [
      { docketNumber: 'docketNumber1', primaryIssue: 'primaryIssue1' },
      {
        docketNumber: TEST_DOCKET_NUMBER,
        primaryIssue: TEST_PRIMARY_ISSUE,
      },
      { docketNumber: 'docketNumber3', primaryIssue: 'primaryIssue3' },
    ];

    expect(
      state.judgeActivityReportData.submittedAndCavCasesByJudge,
    ).toMatchObject(expectedStateResults);
  });
});
