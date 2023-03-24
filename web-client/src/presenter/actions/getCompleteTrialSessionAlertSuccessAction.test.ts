import { getCompleteTrialSessionAlertSuccessAction } from './getCompleteTrialSessionAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getCompleteTrialSessionAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(
      getCompleteTrialSessionAlertSuccessAction,
      {},
    );
    expect(result.output.alertSuccess.message).toEqual(
      'Trial session updated.',
    );
  });
});
