import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { updateUserPendingEmailAction } from './updateUserPendingEmailAction';

describe('updateUserPendingEmailAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the use case to update the user with a pending email', async () => {
    const mockNewEmail = 'test@example.com';

    await runAction(updateUserPendingEmailAction, {
      modules: {
        presenter,
      },
      state: { form: { email: mockNewEmail } },
    });

    expect(
      applicationContext.getUseCases().updateUserPendingEmailInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      pendingEmail: mockNewEmail,
    });
  });
});
