import { clearJudgeActivityReportResultAction } from './clearJudgeActivityReportResultAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearJudgeActivityReportResultAction', () => {
  it('should set judgeActivityReportData to an empty object', async () => {
    const result = await runAction(clearJudgeActivityReportResultAction, {
      state: {
        judgeActivityReportData: [
          {
            endDate: '2017/04/02',
            startDate: '2017/04/02',
          },
        ],
      },
    });

    expect(result.state).toEqual({
      judgeActivityReportData: {},
    });
  });
});
