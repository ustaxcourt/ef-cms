import { GatewayTimeoutError } from '@web-client/presenter/errors/GatewayTimeoutError';
import { TROUBLESHOOTING_INFO } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { verifyUserPendingEmailAction } from './verifyUserPendingEmailAction';
import React from 'react';

describe('verifyUserPendingEmailAction', () => {
  const errorMock = jest.fn();
  const successMock = jest.fn();

  const mockToken = 'abc';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };
  });

  it('should return a success message when the user`s pending email is successfully verified', async () => {
    const { state } = await runAction(verifyUserPendingEmailAction, {
      modules: {
        presenter,
      },
      props: {
        token: mockToken,
      },
      state: {
        alertInfo: 'TEST_ALERT_INFO',
      },
    });

    expect(state.alertInfo).toBeUndefined();

    expect(
      applicationContext.getUseCases().verifyUserPendingEmailInteractor,
    ).toHaveBeenCalledWith(expect.anything(), { token: mockToken });
    expect(successMock).toHaveBeenCalledWith({
      alertSuccess: {
        message:
          'Your email address is verified. You can now log in to DAWSON.',
        title: 'Email address verified',
      },
    });
  });

  it('should return an error message when an error occurred while verifying the user`s pending email', async () => {
    applicationContext
      .getUseCases()
      .verifyUserPendingEmailInteractor.mockRejectedValue(new Error());

    await runAction(verifyUserPendingEmailAction, {
      modules: {
        presenter,
      },
      props: {
        token: mockToken,
      },
    });

    expect(errorMock).toHaveBeenCalledWith({
      alertError: {
        message: (
          <>
            Your request cannot be completed. Please try to log in. If you’re
            still having trouble, contact{' '}
            <a href={`mailto:${TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}`}>
              {TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}
            </a>
            .
          </>
        ),
        title: 'Unable to complete your request',
      },
    });
  });

  it('should return an error message when the token has expired', async () => {
    applicationContext
      .getUseCases()
      .verifyUserPendingEmailInteractor.mockRejectedValue(
        new Error('Link has expired'),
      );

    await runAction(verifyUserPendingEmailAction, {
      modules: {
        presenter,
      },
      props: {
        token: mockToken,
      },
    });

    expect(errorMock).toHaveBeenCalledWith({
      alertError: {
        message: (
          <>
            Enter your old email address and password below, then log in to be
            sent a new verification email.
          </>
        ),
        title: 'Verification email link expired',
      },
    });
  });

  it('should return an error message when the request timed out', async () => {
    applicationContext
      .getUseCases()
      .verifyUserPendingEmailInteractor.mockRejectedValue(
        new GatewayTimeoutError(),
      );

    await runAction(verifyUserPendingEmailAction, {
      modules: {
        presenter,
      },
      props: {
        token: mockToken,
      },
    });

    expect(errorMock).toHaveBeenCalledWith({
      alertError: {
        message: (
          <>
            DAWSON is updating your other contact information. Please wait and
            try to verify your email in a few minutes.
          </>
        ),
        title: 'DAWSON can’t verify your email right now.',
      },
    });
  });
});
