import {
  JudgeActivityReportState,
  initialJudgeActivityReportState,
} from '../judgeActivityReportState';
import { resetJudgeActivityReportStateAction } from './resetJudgeActivityReportStateAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetJudgeActivityReportStateAction', () => {
  it('resets the judge activity report back to its default state', async () => {
    const modifiedJudgeActivityReport: JudgeActivityReportState = {
      ...initialJudgeActivityReportState,
      filters: {
        endDate: 'end',
        judgeName: 'colvin',
        startDate: 'start',
      },
    };

    const { state } = await runAction(resetJudgeActivityReportStateAction, {
      state: {
        judgeActivityReport: modifiedJudgeActivityReport,
      },
    });

    expect(state.judgeActivityReport).toEqual(initialJudgeActivityReportState);
  });
});
