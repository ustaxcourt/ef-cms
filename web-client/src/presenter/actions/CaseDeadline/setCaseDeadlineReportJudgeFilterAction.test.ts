import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseDeadlineReportJudgeFilterAction } from './setCaseDeadlineReportJudgeFilterAction';

describe('setCaseDeadlineReportJudgeFilterAction', () => {
  it('sets state.caseDeadlineReport.judgeFilter to the props.judge passed in', async () => {
    const judgeId = '123456';
    const result = await runAction(setCaseDeadlineReportJudgeFilterAction, {
      modules: { presenter },
      props: {
        selectedJudgeId: judgeId,
      },
      state: {
        caseDeadlineReport: {},
      },
    });

    expect(result.state.caseDeadlineReport.judgeIdFilter).toEqual(judgeId);
  });
});
