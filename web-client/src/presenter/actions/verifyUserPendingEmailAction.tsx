import { GatewayTimeoutErrorTitle } from '@web-client/presenter/errors/GatewayTimeoutError';
import { TROUBLESHOOTING_INFO } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const expiredTokenAlertError = {
  message: (
    <>
      Enter your old email address and password below, then log in to be sent a
      new verification email.
    </>
  ),
  title: 'Verification email link expired',
};

const requestTimedOutAlertError = {
  message: (
    <>
      DAWSON is updating your other contact information. Please wait and try to
      verify your email in a few minutes.
    </>
  ),
  title: 'DAWSON can’t verify your email right now.',
};

export const genericAlertError = {
  message: (
    <>
      Your request cannot be completed. Please try to log in. If you’re still
      having trouble, contact{' '}
      <a href={`mailto:${TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}`}>
        {TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}
      </a>
      .
    </>
  ),
  title: 'Unable to complete your request',
};

export const verifyUserPendingEmailAction = async ({
  applicationContext,
  path,
  props,
  store,
}: ActionProps<{ token: string }>) => {
  const { token } = props;

  try {
    await applicationContext
      .getUseCases()
      .verifyUserPendingEmailInteractor(applicationContext, {
        token,
      });
    store.unset(state.alertInfo);

    return path.success({
      alertSuccess: {
        message:
          'Your email address is verified. You can now log in to DAWSON.',
        title: 'Email address verified',
      },
    });
  } catch (e: any) {
    store.unset(state.alertInfo);
    if (e.message === 'Link has expired') {
      return path.error({
        alertError: expiredTokenAlertError,
      });
    }
    if (e.title === GatewayTimeoutErrorTitle) {
      return path.error({
        alertError: requestTimedOutAlertError,
      });
    }

    return path.error({
      alertError: genericAlertError,
    });
  }
};
