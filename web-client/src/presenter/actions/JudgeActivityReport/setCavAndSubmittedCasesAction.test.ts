import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCavAndSubmittedCasesAction } from './setCavAndSubmittedCasesAction';

describe('setCavAndSubmittedCasesAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockConsolidatedCasesGroupCount = { '101-20': 3 };
  const totalCountForSubmittedAndCavCases = 15;
  const mockCases = [{ docketNumber: '101-20' }, { docketNumber: '102-20' }];

  it('should set cav and submitted related cases data on state.judgeActivityReport', async () => {
    const { state } = await runAction(setCavAndSubmittedCasesAction, {
      modules: {
        presenter,
      },
      props: {
        cases: mockCases,
        consolidatedCasesGroupCountMap: mockConsolidatedCasesGroupCount,
        totalCountForSubmittedAndCavCases,
      },
      state: {
        judgeActivityReport: {
          judgeActivityReportData: {
            consolidatedCasesGroupCountMap: undefined,
            submittedAndCavCasesByJudge: undefined,
            totalCountForSubmittedAndCavCases: undefined,
          },
        },
      },
    });

    expect(
      state.judgeActivityReport.judgeActivityReportData
        .submittedAndCavCasesByJudge,
    ).toEqual(mockCases);

    expect(
      state.judgeActivityReport.judgeActivityReportData
        .consolidatedCasesGroupCountMap,
    ).toEqual(mockConsolidatedCasesGroupCount);

    expect(
      state.judgeActivityReport.judgeActivityReportData
        .totalCountForSubmittedAndCavCases,
    ).toEqual(totalCountForSubmittedAndCavCases);
  });
});
