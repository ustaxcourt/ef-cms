import { petitionerUser } from '@shared/test/mockUsers';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setRumUserContext } from '@web-client/providers/realUserMonitoring';
import { setRumUserContextAction } from './setRumUserContextAction';

jest.mock('@web-client/providers/realUserMonitoring', () => ({
  setRumUserContext: jest.fn(),
}));

describe('setRumUserContextAction', () => {
  it('passes role, section, and userId to the RUM provider', async () => {
    await runAction(setRumUserContextAction, {
      state: {
        user: petitionerUser,
      },
    });

    expect(setRumUserContext).toHaveBeenCalledWith({
      role: petitionerUser.role,
      section: petitionerUser.section,
      userId: petitionerUser.userId,
    });
  });

  it('does nothing when no user is present', async () => {
    await runAction(setRumUserContextAction, {
      state: {
        user: undefined,
      },
    });

    expect(setRumUserContext).not.toHaveBeenCalled();
  });
});
