import { TROUBLESHOOTING_INFO } from '@shared/business/entities/EntityConstants';
import React from 'react';

const expiredTokenAlertError = {
  message: (
    <>
      Enter your old email address and password below, then log in to be sent a
      new verification email.{' '}
      <a href={`mailto:${TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}`}>
        {TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}
      </a>
      .
    </>
  ),
  title: 'Verification email link expired',
};

const genericAlertError = {
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
}: ActionProps<{ token: string }>) => {
  const { token } = props;

  try {
    await applicationContext
      .getUseCases()
      .verifyUserPendingEmailInteractor(applicationContext, {
        token,
      });

    return path.success({
      alertSuccess: {
        message:
          'Your email address is verified. You can now log in to DAWSON.',
        title: 'Email address verified',
      },
    });
  } catch (e: any) {
    if (e.message === 'Link has expired') {
      return path.error({
        alertError: expiredTokenAlertError,
      });
    }
    return path.error({
      alertError: genericAlertError,
    });
  }
};
