import { getSaveCaseForLaterAlertSuccessAction } from './getSaveCaseForLaterAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getSaveCaseForLaterAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(getSaveCaseForLaterAlertSuccessAction, {});
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
