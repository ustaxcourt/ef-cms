import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setJudgeActivityReportDataAction } from './setJudgeActivityReportDataAction';

describe('setJudgeActivityReportDataAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockConsolidatedCasesGroupCount = { '101-20': 3 };
  const totalCountForSubmittedAndCavCases = 15;
  const mockCases = [{ docketNumber: '101-20' }, { docketNumber: '102-20' }];

  it('should set cav and submitted related cases data on state.judgeActivityReport', async () => {
    const { state } = await runAction(setJudgeActivityReportDataAction, {
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
            lastDocketNumberForCavAndSubmittedCasesSearch: undefined,
            submittedAndCavCasesByJudge: undefined,
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
