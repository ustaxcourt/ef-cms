import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitLoginAction } from '@web-client/presenter/actions/Login/submitLoginAction';
import React from 'react';

describe('submitLoginAction', () => {
  const mockSuccessPath = jest.fn();
  const mockChangePasswordPath = jest.fn();
  const mockErrorPath = jest.fn();

  const testEmail = 'example@example.com';
  const testPassword = 'Testing1234$';

  const testAccessToken = 'a0da1fa9-25ed-4d88-bc85-7bbfed68b641';
  const testIdToken = 'af5f3af2-814a-45d6-8d4a-53621a3e8cb9';
  const testRefreshToken = '11973ca6-1a50-4f3c-be8e-1ac5a6c5112a';

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      changePassword: mockChangePasswordPath,
      error: mockErrorPath,
      success: mockSuccessPath,
    };
  });

  it('should call the success path when user is authenticated successfully', async () => {
    applicationContext.getUseCases().loginInteractor.mockResolvedValue({
      accessToken: testAccessToken,
      idToken: testIdToken,
      refreshToken: testRefreshToken,
    });

    await runAction(submitLoginAction, {
      modules: {
        presenter,
      },
      state: {
        authentication: {
          form: {
            code: '',
            confirmPassword: '',
            email: testEmail,
            password: testPassword,
          },
          tempPassword: '',
        },
      },
    });

    expect(
      applicationContext.getUseCases().loginInteractor.mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().loginInteractor.mock.calls[0][1],
    ).toEqual({
      email: testEmail,
      password: testPassword,
    });
    expect(mockSuccessPath).toHaveBeenCalledTimes(1);
    expect(mockChangePasswordPath).not.toHaveBeenCalled();
    expect(mockErrorPath).not.toHaveBeenCalled();
  });

  it('should call the error path with a generic message user is not authenticated because of an unknown error', async () => {
    const mockError = new Error('Something unknown went wrong');
    applicationContext
      .getUseCases()
      .loginInteractor.mockRejectedValue(mockError);

    await runAction(submitLoginAction, {
      modules: {
        presenter,
      },
      state: {
        authentication: {
          form: {
            code: '',
            confirmPassword: '',
            email: testEmail,
            password: testPassword,
          },
          tempPassword: '',
        },
      },
    });

    expect(mockSuccessPath).not.toHaveBeenCalled();
    expect(mockChangePasswordPath).not.toHaveBeenCalled();
    expect(mockErrorPath).toHaveBeenCalledWith({
      alertError: {
        title:
          'There was an unexpected error when logging in. Please try again.',
      },
    });
  });

  it('should call the changePassword path when the provided email is associated an account in NewPasswordRequired state', async () => {
    applicationContext.getUseCases().loginInteractor.mockRejectedValue({
      originalError: { response: { data: 'NewPasswordRequired' } },
    });

    await runAction(submitLoginAction, {
      modules: {
        presenter,
      },
      state: {
        authentication: {
          form: {
            code: '',
            confirmPassword: '',
            email: testEmail,
            password: testPassword,
          },
          tempPassword: '',
        },
      },
    });

    expect(
      applicationContext.getUseCases().loginInteractor.mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().loginInteractor.mock.calls[0][1],
    ).toEqual({
      email: testEmail,
      password: testPassword,
    });

    expect(mockSuccessPath).not.toHaveBeenCalled();
    expect(mockErrorPath).not.toHaveBeenCalled();
    expect(mockChangePasswordPath.mock.calls.length).toEqual(1);
    expect(mockChangePasswordPath).toHaveBeenCalledWith({
      email: testEmail,
      tempPassword: testPassword,
    });
  });

  it('should call the error path with a invalid username or password error when the user is not authenticated because of invalid credentials', async () => {
    applicationContext.getUseCases().loginInteractor.mockRejectedValue({
      originalError: { response: { data: 'Invalid Username or Password' } },
    });

    await runAction(submitLoginAction, {
      modules: {
        presenter,
      },
      state: {
        authentication: {
          form: {
            code: '',
            confirmPassword: '',
            email: testEmail,
            password: 'bad_password',
          },
          tempPassword: '',
        },
      },
    });

    expect(mockSuccessPath).not.toHaveBeenCalled();
    expect(mockChangePasswordPath).not.toHaveBeenCalled();
    expect(mockErrorPath).toHaveBeenCalledWith({
      alertError: {
        message: 'The email address or password you entered is invalid.',
        title: 'Please correct the following errors:',
      },
    });
  });

  it('should call the error path with a password attempts exceeded error when the user has too many failed login attempts', async () => {
    applicationContext.getUseCases().loginInteractor.mockRejectedValue({
      originalError: { response: { data: 'Password attempts exceeded' } },
    });

    await runAction(submitLoginAction, {
      modules: {
        presenter,
      },
      state: {
        authentication: {
          form: {
            code: '',
            confirmPassword: '',
            email: testEmail,
            password: 'bad_password',
          },
          tempPassword: '',
        },
      },
    });

    expect(mockSuccessPath).not.toHaveBeenCalled();
    expect(mockChangePasswordPath).not.toHaveBeenCalled();
    expect(mockErrorPath).toHaveBeenCalledWith({
      alertError: {
        message: (
          <>
            You can try again later or reset your password. If you’re still
            having problems, contact{' '}
            <a href="mailto:dawson.support@ustaxcourt.gov">
              dawson.support@ustaxcourt.gov
            </a>
            .
          </>
        ),
        title: 'Too many unsuccessful log ins',
      },
    });
  });

  it('should call the error path with a user is unconfirmed message when the user is not authenticated because their account is not yet confirmed', async () => {
    applicationContext.getUseCases().loginInteractor.mockRejectedValue({
      originalError: { response: { data: 'User is unconfirmed' } },
    });

    await runAction(submitLoginAction, {
      modules: {
        presenter,
      },
      state: {
        authentication: {
          form: {
            code: '',
            confirmPassword: '',
            email: testEmail,
            password: testPassword,
          },
          tempPassword: '',
        },
      },
    });

    expect(mockSuccessPath).not.toHaveBeenCalled();
    expect(mockChangePasswordPath).not.toHaveBeenCalled();
    expect(mockErrorPath).toHaveBeenCalledWith({
      alertError: {
        message: (
          <>
            The email address is associated with an account but is not verified.
            We sent an email with a link to verify the email address. If you
            don’t see it, check your spam folder. If you’re still having
            trouble, email{' '}
            <a href="mailto:dawson.support@ustaxcourt.gov">
              dawson.support@ustaxcourt.gov
            </a>
            .
          </>
        ),
        title: 'Email address not verified',
      },
    });
  });
});
