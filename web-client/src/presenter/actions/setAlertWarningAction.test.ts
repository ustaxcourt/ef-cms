import { runAction } from '@web-client/presenter/test.cerebral';
import { setAlertWarningAction } from './setAlertWarningAction';

describe('alertAlertWarningAction', () => {
  it('sets an alert depicting it as a "warning" type', async () => {
    const result = await runAction(setAlertWarningAction, {
      props: {
        alertWarning: {
          message: 'Alert warning message!',
          title: 'Alert warning title',
        },
      },
    });

    expect(result.state.alertWarning).toMatchObject({
      message: 'Alert warning message!',
      title: 'Alert warning title',
    });
  });
});
