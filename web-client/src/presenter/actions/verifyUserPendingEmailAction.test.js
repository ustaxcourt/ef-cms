import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
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
