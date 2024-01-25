import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { refreshTokenAction } from '@web-client/presenter/actions/Login/refreshTokenAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('refreshTokenAction', () => {
  const mockUserIsLoggedInPath = jest.fn();
  const mockUserIsNotLoggedInPath = jest.fn();

  const idToken = 'token-123';

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      userIsLoggedIn: mockUserIsLoggedInPath,
      userIsNotLoggedIn: mockUserIsNotLoggedInPath,
    };
  });

  it('should call the userIsLoggedIn path when id token is renewed successfully', async () => {
    applicationContext
      .getUseCases()
      .renewIdTokenInteractor.mockResolvedValue({ idToken });

    await runAction(refreshTokenAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(
      applicationContext.getUseCases().renewIdTokenInteractor.mock.calls.length,
    ).toEqual(1);

    expect(mockUserIsLoggedInPath).toHaveBeenCalledWith({
      idToken,
    });
    expect(mockUserIsNotLoggedInPath).not.toHaveBeenCalled();
  });

  it('should call the userIsNotLoggedIn path when renewIdTokenInteractor throws an error', async () => {
    const mockError = new Error('Something unknown went wrong');
    applicationContext
      .getUseCases()
      .renewIdTokenInteractor.mockRejectedValue(mockError);

    await runAction(refreshTokenAction, {
      modules: {
        presenter,
      },
      state: {},
    }),
      expect(mockUserIsLoggedInPath).not.toHaveBeenCalled();
    expect(mockUserIsNotLoggedInPath).toHaveBeenCalled();
  });
});
