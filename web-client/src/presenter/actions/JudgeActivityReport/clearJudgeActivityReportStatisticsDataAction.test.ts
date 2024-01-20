import { clearJudgeActivityReportStatisticsDataAction } from '@web-client/presenter/actions/JudgeActivityReport/clearJudgeActivityReportStatisticsDataAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearJudgeActivityReportStatisticsDataAction', () => {
  it('should clear judge activity statistics data', async () => {
    const result = await runAction(
      clearJudgeActivityReportStatisticsDataAction,
      {
        state: {
          judgeActivityReport: {
            judgeActivityReportData: {
              casesClosedByJudge: { someData: 'string' },
              opinions: { someData: 'string' },
              orders: { someData: 'string' },
              trialSessions: { someData: 'string' },
            },
          },
        },
      },
    );

    expect(
      result.state.judgeActivityReport.judgeActivityReportData
        .casesClosedByJudge,
    ).toEqual({});
    expect(
      result.state.judgeActivityReport.judgeActivityReportData.opinions,
    ).toEqual({});
    expect(
      result.state.judgeActivityReport.judgeActivityReportData.orders,
    ).toEqual({});
    expect(
      result.state.judgeActivityReport.judgeActivityReportData.trialSessions,
    ).toEqual({});
  });
});
