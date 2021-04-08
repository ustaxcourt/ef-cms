import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setUserPendingEmailForPrimaryAndSecondaryAction } from './setUserPendingEmailForPrimaryAndSecondaryAction';

describe('setUserPendingEmailForPrimaryAndSecondaryAction', () => {
  const mockEmail = 'error@example.com';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('set state.screenMetadata.contactPrimaryPendingEmail from props.contactPrimaryPendingEmail', async () => {
    const { state } = await runAction(
      setUserPendingEmailForPrimaryAndSecondaryAction,
      {
        props: {
          contactPrimaryPendingEmail: mockEmail,
        },
      },
    );

    expect(state.screenMetadata.contactPrimaryPendingEmail).toBe(mockEmail);
  });

  it('set state.screenMetadata.contactPrimaryPendingEmail to undefined when props.contactPrimaryPendingEmail is undefined', async () => {
    const { state } = await runAction(
      setUserPendingEmailForPrimaryAndSecondaryAction,
      {
        props: {
          contactPrimaryPendingEmail: undefined,
        },
      },
    );

    expect(state.screenMetadata.contactPrimaryPendingEmail).toBeUndefined();
  });

  it('set state.screenMetadata.contactSecondaryPendingEmail from props.contactSecondaryPendingEmail', async () => {
    const { state } = await runAction(
      setUserPendingEmailForPrimaryAndSecondaryAction,
      {
        props: {
          contactSecondaryPendingEmail: mockEmail,
        },
      },
    );

    expect(state.screenMetadata.contactSecondaryPendingEmail).toBe(mockEmail);
  });

  it('set state.screenMetadata.contactSecondaryPendingEmail to undefined when props.contactSecondaryPendingEmail is undefined', async () => {
    const { state } = await runAction(
      setUserPendingEmailForPrimaryAndSecondaryAction,
      {
        props: {
          contactSecondaryPendingEmail: undefined,
        },
      },
    );

    expect(state.screenMetadata.contactSecondaryPendingEmail).toBeUndefined();
  });
});
