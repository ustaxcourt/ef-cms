import { getCreateTrialSessionAlertSuccessAction } from './getCreateTrialSessionAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getCreateTrialSessionAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(getCreateTrialSessionAlertSuccessAction, {});
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
