import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { getPreviousTrialSessionProceedingTypeAction } from './getPreviousTrialSessionProceedingTypeAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getPreviousTrialSessionProceedingTypeAction', () => {
  it('should return the current proceeding type before the form value changes', async () => {
    const result = await runAction(
      getPreviousTrialSessionProceedingTypeAction,
      {
        state: {
          form: { proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.reporting },
        },
      },
    );

    expect(result.output).toEqual({
      previousProceedingType: TRIAL_SESSION_PROCEEDING_TYPES.reporting,
    });
  });
});
