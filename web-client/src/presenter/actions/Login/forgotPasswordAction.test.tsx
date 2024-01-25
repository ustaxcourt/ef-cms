import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { forgotPasswordAction } from '@web-client/presenter/actions/Login/forgotPasswordAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import React from 'react';

describe('forgotPasswordAction', () => {
  const mockSuccessPath = jest.fn();
  const mockUnconfirmedAccountPath = jest.fn();

  const TEST_EMAIL = 'example@example.com';

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      success: mockSuccessPath,
      unconfirmedAccount: mockUnconfirmedAccountPath,
    };
  });

  it('should call the success path when reset password email was sent successfully', async () => {
    applicationContext
      .getUseCases()
      .forgotPasswordInteractor.mockResolvedValue({});

    await runAction(forgotPasswordAction, {
      modules: {
        presenter,
      },
      state: {
        authentication: {
          form: {
            email: TEST_EMAIL,
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().forgotPasswordInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().forgotPasswordInteractor.mock
        .calls[0][1],
    ).toEqual({
      email: TEST_EMAIL,
    });
    expect(mockSuccessPath).toHaveBeenCalledWith({
      alertSuccess: {
        message: (
          <>
            If there is a DAWSON account for {TEST_EMAIL}, we’ll send a password
            reset email. If you’re still having trouble, contact{' '}
            <a href="mailto:dawson.support@ustaxcourt.gov">
              dawson.support@ustaxcourt.gov
            </a>
            .
          </>
        ),
        title: 'Password reset email sent',
      },
    });
    expect(mockUnconfirmedAccountPath).not.toHaveBeenCalled();
  });

  it('should call the error path with a generic message when reset password email was not sent because of an unknown error', async () => {
    const mockError = new Error('Something unknown went wrong');
    applicationContext
      .getUseCases()
      .forgotPasswordInteractor.mockRejectedValue(mockError);

    await expect(
      runAction(forgotPasswordAction, {
        modules: {
          presenter,
        },
        state: {
          authentication: {
            form: {
              email: TEST_EMAIL,
            },
          },
        },
      }),
    ).rejects.toEqual(mockError);

    expect(mockSuccessPath).not.toHaveBeenCalled();
    expect(mockUnconfirmedAccountPath).not.toHaveBeenCalled();
  });

  it('should call the error path when the provided email is associated with an unconfirmed account', async () => {
    applicationContext
      .getUseCases()
      .forgotPasswordInteractor.mockRejectedValue({
        originalError: { response: { data: 'User is unconfirmed' } },
      });

    await runAction(forgotPasswordAction, {
      modules: {
        presenter,
      },
      state: {
        authentication: {
          form: {
            email: TEST_EMAIL,
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().forgotPasswordInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().forgotPasswordInteractor.mock
        .calls[0][1],
    ).toEqual({
      email: TEST_EMAIL,
    });
    expect(mockSuccessPath).not.toHaveBeenCalled();
    expect(mockUnconfirmedAccountPath.mock.calls.length).toEqual(1);
    expect(mockUnconfirmedAccountPath).toHaveBeenCalledWith({
      alertWarning: {
        message: (
          <>
            We sent you an email to help you log in. If you don’t see it, check
            your spam folder. If you’re still having trouble, email{' '}
            <a href="mailto:dawson.support@ustaxcourt.gov">
              dawson.support@ustaxcourt.gov
            </a>
            .
          </>
        ),
        title: 'We’ve sent you an email',
      },
    });
  });
});
