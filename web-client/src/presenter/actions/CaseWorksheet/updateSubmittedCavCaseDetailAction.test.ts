import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateSubmittedCavCaseDetailAction } from './updateSubmittedCavCaseDetailAction';

describe('updateSubmittedCavCaseDetailAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const TEST_DOCKET_NUMBER = '999-99';

  it('sending in both the brief data and status of matter should be persisted to the backend', async () => {
    const TEST_FINAL_BRIEF_DUE_DATE = '08/28/2023';
    const TEST_STATUS_OF_MATTER = 'Drafting';

    applicationContext
      .getUseCases()
      .updateCaseWorksheetInfoInteractor.mockReturnValue(null);

    const { state } = await runAction(
      updateSubmittedCavCaseDetailAction as any,
      {
        modules: {
          presenter,
        },
        props: {
          docketNumber: TEST_DOCKET_NUMBER,
          finalBriefDueDate: TEST_FINAL_BRIEF_DUE_DATE,
          statusOfMatter: TEST_STATUS_OF_MATTER,
        },
        state: {
          judgeActivityReportData: {
            submittedAndCavCasesByJudge: [
              { docketNumber: 'docketNumber1', primaryIssue: 'primaryIssue1' },
              {
                docketNumber: TEST_DOCKET_NUMBER,
                statusOfMatter: '',
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
        statusOfMatter: TEST_STATUS_OF_MATTER,
      },
      { docketNumber: 'docketNumber3', primaryIssue: 'primaryIssue3' },
    ];

    expect(
      state.judgeActivityReportData.submittedAndCavCasesByJudge,
    ).toMatchObject(expectedStateResults);

    expect(
      applicationContext.getUseCases().updateCaseWorksheetInfoInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: TEST_DOCKET_NUMBER,
      finalBriefDueDate: TEST_FINAL_BRIEF_DUE_DATE,
      statusOfMatter: TEST_STATUS_OF_MATTER,
    });
  });

  it('sending in both the brief data and status of matter should be persisted to the backend', async () => {
    const TEST_FINAL_BRIEF_DUE_DATE = '08/28/aaaa';
    const TEST_STATUS_OF_MATTER = 'Drafting';

    applicationContext
      .getUseCases()
      .updateCaseWorksheetInfoInteractor.mockReturnValue(null);

    const { state } = await runAction(
      updateSubmittedCavCaseDetailAction as any,
      {
        modules: {
          presenter,
        },
        props: {
          docketNumber: TEST_DOCKET_NUMBER,
          finalBriefDueDate: TEST_FINAL_BRIEF_DUE_DATE,
          statusOfMatter: TEST_STATUS_OF_MATTER,
        },
        state: {
          judgeActivityReportData: {
            submittedAndCavCasesByJudge: [
              { docketNumber: 'docketNumber1', primaryIssue: 'primaryIssue1' },
              {
                docketNumber: TEST_DOCKET_NUMBER,
                statusOfMatter: '',
              },
              { docketNumber: 'docketNumber3', primaryIssue: 'primaryIssue3' },
            ],
          },
        },
      },
    );

    expect(
      state.judgeDashboardCaseWorksheetErrors[TEST_DOCKET_NUMBER]
        .finalBriefDueDate,
    ).toEqual('Enter a valid due date.');

    expect(
      applicationContext.getUseCases().updateCaseWorksheetInfoInteractor,
    ).not.toHaveBeenCalled();
  });
});
