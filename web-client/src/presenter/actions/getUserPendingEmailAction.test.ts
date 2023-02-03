import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getUserPendingEmailAction } from './getUserPendingEmailAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getUserPendingEmailAction', () => {
  const mockUserId = 'e14762ee-fc2f-4a9e-ba2c-2160469d2d04';
  const mockEmail = 'error@example.com';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should make a call to getUserPendingEmailInteractor with props.contactId', async () => {
    await runAction(getUserPendingEmailAction, {
      modules: {
        presenter,
      },
      props: { contactId: mockUserId },
    });

    expect(
      applicationContext.getUseCases().getUserPendingEmailInteractor.mock
        .calls[0][1].userId,
    ).toBe(mockUserId);
  });

  it('should return userPendingEmail as props', async () => {
    applicationContext
      .getUseCases()
      .getUserPendingEmailInteractor.mockReturnValue(mockEmail);

    const { output } = await runAction(getUserPendingEmailAction, {
      modules: {
        presenter,
      },
      props: { contactId: mockUserId },
    });

    expect(output.userPendingEmail).toBe(mockEmail);
  });

  it('should return undefined for props.userPendingEmail when one is not returned from the use case', async () => {
    applicationContext
      .getUseCases()
      .getUserPendingEmailInteractor.mockReturnValue(undefined);

    const { output } = await runAction(getUserPendingEmailAction, {
      modules: {
        presenter,
      },
      props: { contactId: mockUserId },
    });

    expect(output.userPendingEmail).toBeUndefined();
  });
});
