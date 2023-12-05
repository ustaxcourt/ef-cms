import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCavAndSubmittedCasesAction } from './setCavAndSubmittedCasesAction';

describe('setCavAndSubmittedCasesAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockCases = [{ docketNumber: '101-20' }, { docketNumber: '102-20' }];

  it('should set cav and submitted related cases data on state.judgeActivityReport', async () => {
    const { state } = await runAction(setCavAndSubmittedCasesAction, {
      modules: {
        presenter,
      },
      props: {
        cases: mockCases,
      },
      state: {
        judgeActivityReport: {
          judgeActivityReportData: {
            submittedAndCavCasesByJudge: undefined,
          },
        },
      },
    });

    expect(
      state.judgeActivityReport.judgeActivityReportData
        .submittedAndCavCasesByJudge,
    ).toEqual(mockCases);
  });
});
