import { runAction } from '@web-client/presenter/test.cerebral';
import { setInitialVerifyAlertMessageAction } from '@web-client/presenter/actions/setInitialVerifyAlertMessageAction';

describe('setInitialVerifyAlertMessageAction', () => {
  it('should return the correct alertInfo data', async () => {
    const { output } = await runAction(setInitialVerifyAlertMessageAction, {});

    expect(output).toEqual({
      alertInfo: {
        message: 'DAWSON is updating your email. Please wait.',
        title: 'Updating email address',
      },
    });
  });
});
