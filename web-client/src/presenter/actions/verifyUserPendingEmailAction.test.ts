import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { verifyUserPendingEmailAction } from './verifyUserPendingEmailAction';

describe('verifyUserPendingEmailAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should make a call to verifyUserPendingEmailInteractor and return an alertSuccess', async () => {
    applicationContext
      .getUseCases()
      .verifyUserPendingEmailInteractor.mockReturnValue();
    const result = await runAction(verifyUserPendingEmailAction, {
      modules: {
        presenter,
      },
      props: {
        token: 'abc',
      },
      state: { form: { contact: {} } },
    });

    expect(
      applicationContext.getUseCases().verifyUserPendingEmailInteractor.mock
        .calls[0][1].token,
    ).toEqual('abc');

    expect(result.output).toEqual({
      alertSuccess: {
        message:
          'Your email address is verified. You can now sign in to DAWSON.',
        title: 'Email address verified',
      },
    });
  });
});
