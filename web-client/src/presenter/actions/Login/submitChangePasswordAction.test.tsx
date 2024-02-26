import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitChangePasswordAction } from '@web-client/presenter/actions/Login/submitChangePasswordAction';
import React from 'react';

describe('submitChangePasswordAction', () => {
  const mockSuccessPath = jest.fn();
  const mockUnconfirmedAccountPath = jest.fn();
  const mockCodeExpiredPath = jest.fn();
  const mockErrorPath = jest.fn();

  const testEmail = 'example@example.com';
  const testTempPassword = 'abc123';
  const testPassword = 'Testing1234$';
  const testConfirmPassword = testPassword;

  const testAccessToken = 'a0da1fa9-25ed-4d88-bc85-7bbfed68b641';
  const testIdToken = 'af5f3af2-814a-45d6-8d4a-53621a3e8cb9';
  const testRefreshToken = '11973ca6-1a50-4f3c-be8e-1ac5a6c5112a';

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      codeExpired: mockCodeExpiredPath,
      error: mockErrorPath,
      success: mockSuccessPath,
      unconfirmedAccount: mockUnconfirmedAccountPath,
    };
  });

  it('should call the success path when password was changed successfully', async () => {
    applicationContext
      .getUseCases()
      .changePasswordInteractor.mockResolvedValue({
        accessToken: testAccessToken,
        idToken: testIdToken,
        refreshToken: testRefreshToken,
      });

    await runAction(submitChangePasswordAction, {
      modules: {
        presenter,
      },
      state: {
        authentication: {
          code: '',
          form: {
            confirmPassword: testConfirmPassword,
            email: testEmail,
            password: testPassword,
          },
          tempPassword: testTempPassword,
        },
      },
    });

    expect(
      applicationContext.getUseCases().changePasswordInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().changePasswordInteractor.mock
        .calls[0][1],
    ).toEqual({
      code: '',
      confirmPassword: testConfirmPassword,
      email: testEmail,
      password: testPassword,
      tempPassword: testTempPassword,
    });
    expect(mockSuccessPath).toHaveBeenCalledTimes(1);
    expect(mockUnconfirmedAccountPath).not.toHaveBeenCalled();
    expect(mockCodeExpiredPath).not.toHaveBeenCalled();
    expect(mockErrorPath).not.toHaveBeenCalled();
  });

  it('should call the error path with a generic message when password was not changed because of an unknown error', async () => {
    const mockError = new Error('Something unknown went wrong');
    applicationContext
      .getUseCases()
      .changePasswordInteractor.mockRejectedValue(mockError);

    await runAction(submitChangePasswordAction, {
      modules: {
        presenter,
      },
      state: {
        authentication: {
          code: '',
          form: {
            confirmPassword: testConfirmPassword,
            email: testEmail,
            password: testPassword,
          },
          tempPassword: testTempPassword,
        },
      },
    });

    expect(mockSuccessPath).not.toHaveBeenCalled();
    expect(mockUnconfirmedAccountPath).not.toHaveBeenCalled();
    expect(mockCodeExpiredPath).not.toHaveBeenCalled();
    expect(mockErrorPath).toHaveBeenCalledWith({
      alertError: {
        message: (
          <>
            Please contact{' '}
            <a href="mailto:dawson.support@ustaxcourt.gov">
              dawson.support@ustaxcourt.gov
            </a>
            .
          </>
        ),
        title: 'Unable to change password',
      },
    });
  });

  it('should call the unconfirmedAccount path when the provided email is associated with an unconfirmed account', async () => {
    applicationContext
      .getUseCases()
      .changePasswordInteractor.mockRejectedValue({
        originalError: { response: { data: 'User is unconfirmed' } },
      });

    await runAction(submitChangePasswordAction, {
      modules: {
        presenter,
      },
      state: {
        authentication: {
          code: '',
          form: {
            confirmPassword: testConfirmPassword,
            email: testEmail,
            password: testPassword,
          },
          tempPassword: testTempPassword,
        },
      },
    });

    expect(
      applicationContext.getUseCases().changePasswordInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().changePasswordInteractor.mock
        .calls[0][1],
    ).toEqual({
      code: '',
      confirmPassword: testConfirmPassword,
      email: testEmail,
      password: testPassword,
      tempPassword: testTempPassword,
    });

    expect(mockSuccessPath).not.toHaveBeenCalled();
    expect(mockCodeExpiredPath).not.toHaveBeenCalled();
    expect(mockErrorPath).not.toHaveBeenCalled();
    expect(mockUnconfirmedAccountPath.mock.calls.length).toEqual(1);
    expect(mockUnconfirmedAccountPath).toHaveBeenCalledWith({
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

  it('should call the unconfirmedAccount path when the provided code has expired', async () => {
    applicationContext
      .getUseCases()
      .changePasswordInteractor.mockRejectedValue({
        originalError: { response: { data: 'Forgot password code expired' } },
      });

    await runAction(submitChangePasswordAction, {
      modules: {
        presenter,
      },
      state: {
        authentication: {
          code: 'expired_code',
          form: {
            confirmPassword: testConfirmPassword,
            email: testEmail,
            password: testPassword,
          },
          tempPassword: '',
        },
      },
    });

    expect(
      applicationContext.getUseCases().changePasswordInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().changePasswordInteractor.mock
        .calls[0][1],
    ).toEqual({
      code: 'expired_code',
      confirmPassword: testConfirmPassword,
      email: testEmail,
      password: testPassword,
      tempPassword: '',
    });

    expect(mockSuccessPath).not.toHaveBeenCalled();
    expect(mockUnconfirmedAccountPath).not.toHaveBeenCalled();
    expect(mockErrorPath).not.toHaveBeenCalled();
    expect(mockCodeExpiredPath.mock.calls.length).toEqual(1);
    expect(mockCodeExpiredPath).toHaveBeenCalledWith({
      alertError: {
        message: (
          <>
            The code you entered is incorrect or expired. You can{' '}
            <a href="/forgot-password">request a new code</a>. If you’re still
            having trouble, contact{' '}
            <a href="mailto:dawson.support@ustaxcourt.gov">
              dawson.support@ustaxcourt.gov
            </a>
            .
          </>
        ),
        title: 'Invalid verification code',
      },
    });
  });
});
