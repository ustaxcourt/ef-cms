import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setUserPendingEmailAction } from './setUserPendingEmailAction';

describe('setUserPendingEmailAction', () => {
  const mockEmail = 'error@example.com';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('set state.screenMetadata.userPendingEmail from props.userPendingEmail', async () => {
    const { state } = await runAction(setUserPendingEmailAction, {
      props: {
        userPendingEmail: mockEmail,
      },
    });

    expect(state.screenMetadata.userPendingEmail).toBe(mockEmail);
  });

  it('set state.screenMetadata.userPendingEmail to undefined when props.userPendingEmail is undefined', async () => {
    const { state } = await runAction(setUserPendingEmailAction, {
      props: {
        userPendingEmail: undefined,
      },
    });

    expect(state.screenMetadata.userPendingEmail).toBeUndefined();
  });
});
