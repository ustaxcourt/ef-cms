import { getServeToIrsAlertSuccessAction } from './getServeToIrsAlertSuccessAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getServeToIrsAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(getServeToIrsAlertSuccessAction, {});
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
