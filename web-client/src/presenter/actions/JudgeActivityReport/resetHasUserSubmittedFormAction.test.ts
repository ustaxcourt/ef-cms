import { resetHasUserSubmittedFormAction } from '@web-client/presenter/actions/JudgeActivityReport/resetHasUserSubmittedFormAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetHasUserSubmittedFormAction', () => {
  it('should reset hasUserSubmittedForm', async () => {
    const result = await runAction(resetHasUserSubmittedFormAction, {
      state: {
        judgeActivityReport: {
          hasUserSubmittedForm: true,
        },
      },
    });
    expect(result.state.judgeActivityReport.hasUserSubmittedForm).toBeFalsy();
  });
});
