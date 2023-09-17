import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { verifyUserPendingEmailAction } from './verifyUserPendingEmailAction';

describe('verifyUserPendingEmailAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should make a call to verifyUserPendingEmailInteractor', () => {
    applicationContext
      .getUseCases()
      .verifyUserPendingEmailInteractor.mockReturnValue();
    runAction(verifyUserPendingEmailAction, {
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
  });
});
