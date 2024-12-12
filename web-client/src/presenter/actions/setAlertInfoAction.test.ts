import { runAction } from '@web-client/presenter/test.cerebral';
import { setAlertInfoAction } from '@web-client/presenter/actions/setAlertInfoAction';

describe('setAlertInfoAction', () => {
  it('should set alertInfo in state correctly', async () => {
    const TEST_ALERT_INFO = 'TEST_ALERT_INFO';
    const { state } = await runAction(setAlertInfoAction, {
      props: {
        alertInfo: TEST_ALERT_INFO,
      },
    });

    expect(state.alertInfo).toEqual(TEST_ALERT_INFO);
  });
});
