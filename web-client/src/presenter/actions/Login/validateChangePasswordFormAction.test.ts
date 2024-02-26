import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateChangePasswordFormAction } from '@web-client/presenter/actions/Login/validateChangePasswordFormAction';

describe('validateChangePasswordFormAction', () => {
  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  const TEST_EMAIL = 'example@example.com';
  const TEST_PASSWORD = 'aA1!aaaa';
  const TEST_CONFIRM_PASSWORD = TEST_PASSWORD;

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: mockErrorPath,
      success: mockSuccessPath,
    };
  });

  it('should call the success path when the authentication form passes ChangePasswordForm validation', async () => {
    await runAction(validateChangePasswordFormAction, {
      modules: {
        presenter,
      },
      state: {
        authentication: {
          form: {
            code: '',
            confirmPassword: TEST_CONFIRM_PASSWORD,
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
          },
        },
      },
    });

    expect(mockSuccessPath.mock.calls.length).toEqual(1);
    expect(mockErrorPath).not.toHaveBeenCalled();
  });

  it('should call the error path when the authentication form has an invalid email', async () => {
    await runAction(validateChangePasswordFormAction, {
      modules: {
        presenter,
      },
      state: {
        authentication: {
          form: {
            code: '',
            confirmPassword: TEST_CONFIRM_PASSWORD,
            email: 'invalid@example',
            password: TEST_PASSWORD,
          },
        },
      },
    });

    expect(mockErrorPath.mock.calls.length).toEqual(1);
    expect(mockSuccessPath).not.toHaveBeenCalled();
  });

  it('should call the error path when the authentication form has incongruent password and confirmPassword fields', async () => {
    await runAction(validateChangePasswordFormAction, {
      modules: {
        presenter,
      },
      state: {
        authentication: {
          form: {
            code: '',
            confirmPassword: TEST_CONFIRM_PASSWORD,
            email: TEST_EMAIL,
            password: 'not_test_password',
          },
        },
      },
    });

    expect(mockErrorPath.mock.calls.length).toEqual(1);
    expect(mockSuccessPath).not.toHaveBeenCalled();
  });

  it('should call the error path when the authentication form has an invalid password', async () => {
    const mockInvalidPassword = 'abc';
    await runAction(validateChangePasswordFormAction, {
      modules: {
        presenter,
      },
      state: {
        authentication: {
          form: {
            code: '',
            confirmPassword: mockInvalidPassword,
            email: TEST_EMAIL,
            password: mockInvalidPassword,
          },
        },
      },
    });

    expect(mockErrorPath.mock.calls.length).toEqual(1);
    expect(mockSuccessPath).not.toHaveBeenCalled();
  });
});
