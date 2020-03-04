import { getServeToIrsAlertSuccessAction } from './getServeToIrsAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getServeToIrsAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(getServeToIrsAlertSuccessAction, {});
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
