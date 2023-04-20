import { clearJudgeActivityReportResultAction } from './clearJudgeActivityReportResultAction';
import { runAction } from 'cerebral/test';

describe('clearJudgeActivityReportResultAction', () => {
  it('clears judgeActivityReportData and sets advancedSearchForm.currentPage to 1', async () => {
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
