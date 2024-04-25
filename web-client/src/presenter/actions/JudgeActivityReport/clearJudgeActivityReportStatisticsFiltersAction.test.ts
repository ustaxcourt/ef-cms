import { clearJudgeActivityReportStatisticsFiltersAction } from '@web-client/presenter/actions/JudgeActivityReport/clearJudgeActivityReportStatisticsFiltersAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearJudgeActivityReportStatisticsFiltersAction', () => {
  it('should clear judge activity report filters', async () => {
    const result = await runAction(
      clearJudgeActivityReportStatisticsFiltersAction,
      {
        state: {
          judgeActivityReport: {
            filters: {
              endDate: '08/02/2022',
              startDate: '02/02/2022',
            },
          },
        },
      },
    );
    expect(result.state.judgeActivityReport.filters.startDate).toEqual('');
    expect(result.state.judgeActivityReport.filters.endDate).toEqual('');
  });
});
