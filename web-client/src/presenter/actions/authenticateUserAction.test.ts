import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { authenticateUserAction } from './authenticateUserAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('authenticateUserAction', () => {
  let mockYes;
  let mockNo;
  let mockNewPasswordRequired;

  beforeAll(() => {
    mockYes = jest.fn();
    mockNo = jest.fn();
    mockNewPasswordRequired = jest.fn();

    presenter.providers.path = {
      newPasswordRequired: mockNewPasswordRequired,
      no: mockNo,
      yes: mockYes,
    };

    applicationContext
      .getUseCases()
      .authenticateUserInteractor.mockImplementation((appContext, { code }) => {
        return {
          token: `token-${code}`,
        };
      });
    presenter.providers.applicationContext = applicationContext;
  });

  it('calls the authenticateUserInteractor with the given code from props, returns its response tokens, and calls mockYes path', async () => {
    await runAction(authenticateUserAction, {
      modules: {
        presenter,
      },
      props: {
        code: '123',
      },
      state: {},
    });

    expect(
      applicationContext.getUseCases().authenticateUserInteractor.mock.calls
        .length,
    ).toEqual(1);

    expect(mockYes.mock.calls[0][0]).toMatchObject({
      token: 'token-123',
    });
  });

  it('finds an alert error and calls mockNo path when login is invalid', async () => {
    const mockAlertError = {
      alertError: {
        message: 'login is invalid',
        title: 'invalid',
      },
    };
    applicationContext
      .getUseCases()
      .authenticateUserInteractor.mockImplementationOnce(() => {
        return mockAlertError;
      });

    await runAction(authenticateUserAction, {
      modules: {
        presenter,
      },
      props: {
        code: '123',
      },
      state: {},
    });

    expect(mockNo.mock.calls[0][0]).toMatchObject(mockAlertError);
  });

  describe('cognitoLocal', () => {
    it('should prepare state for the change password form when authenticateUserInteractor returns NEW_PASSWORD_REQUIRED', async () => {
      const code = 'abc@efg.com';
      const password = 'Password!';
      const sessionId = 'asd4wd2csdfsd';

      const mockAlertError = {
        alertError: { message: 'NEW_PASSWORD_REQUIRED', sessionId },
      };

      applicationContext
        .getUseCases()
        .authenticateUserInteractor.mockImplementationOnce(() => {
          return mockAlertError;
        });

      const { state } = await runAction(authenticateUserAction, {
        modules: {
          presenter,
        },
        props: {
          code,
          password,
        },
        state: {},
      });

      expect(state.login.userEmail).toEqual(code);
      expect(state.login.sessionId).toEqual(sessionId);

      expect(mockNewPasswordRequired.mock.calls[0][0]).toMatchObject({
        path: '/change-password-local',
      });
    });
  });
});
