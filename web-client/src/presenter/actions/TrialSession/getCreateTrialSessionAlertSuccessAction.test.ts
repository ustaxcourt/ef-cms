import { getCreateTrialSessionAlertSuccessAction } from './getCreateTrialSessionAlertSuccessAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCreateTrialSessionAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(getCreateTrialSessionAlertSuccessAction, {});
    expect(result.output.alertSuccess).toBeTruthy();
  });

  it('should set the trialSessionId from props on the state as the lastCreatedTrialSessionId', async () => {
    const result = await runAction(getCreateTrialSessionAlertSuccessAction, {
      props: {
        trialSession: '123',
      },
    });
    expect(result.state.lastCreatedTrialSessionId).toEqual('123');
  });
});
