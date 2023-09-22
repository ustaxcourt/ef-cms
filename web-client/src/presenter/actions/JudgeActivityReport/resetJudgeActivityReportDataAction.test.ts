import { resetJudgeActivityReportDataAction } from './resetJudgeActivityReportDataAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetJudgeActivityReportDataAction', () => {
  it('should set state.judgeActivityReport.judgeActivityReportData to an empty object', async () => {
    const result = await runAction(resetJudgeActivityReportDataAction, {
      state: {
        judgeActivityReport: {
          judgeActivityReportData: {
            opinions: [],
            orders: [],
          },
        },
      },
    });

    expect(result.state.judgeActivityReport.judgeActivityReportData).toEqual(
      {},
    );
  });
});
