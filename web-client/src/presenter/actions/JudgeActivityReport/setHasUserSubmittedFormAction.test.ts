import { runAction } from '@web-client/presenter/test.cerebral';
import { setHasUserSubmittedFormAction } from '@web-client/presenter/actions/JudgeActivityReport/setHasUserSubmittedFormAction';

describe('setHasUserSubmittedFormAction', () => {
  it('should set default submitted/CAV sort order to descending', async () => {
    const result = await runAction(setHasUserSubmittedFormAction, {
      state: {
        judgeActivityReport: {
          hasUserSubmittedForm: undefined,
        },
      },
    });

    expect(result.state.judgeActivityReport.hasUserSubmittedForm).toEqual(true);
  });
});
