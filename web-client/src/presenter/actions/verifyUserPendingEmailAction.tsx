import { TROUBLESHOOTING_INFO } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const successAlertMessage = {
  message: 'Your email address is verified. You can now log in to DAWSON.',
  title: 'Email address verified',
};

const expiredTokenAlertError = {
  message: (
    <>
      Enter your old email address and password below, then log in to be sent a
      new verification email.
    </>
  ),
  title: 'Verification email link expired',
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

type VerifyEmailNotificationType = 'success' | 'expiredToken';

const alertDictionary: { [key in VerifyEmailNotificationType]: any } = {
  expiredToken: expiredTokenAlertError,
  success: successAlertMessage,
};

const alertKeyDictionary: { [key in VerifyEmailNotificationType]: any } = {
  expiredToken: 'alertWarning',
  success: 'alertSuccess',
};

export const verifyUserPendingEmailAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps<{ token: string }>) => {
  const clientConnectionId = get(state.clientConnectionId);
  const { token } = props;

  await applicationContext
    .getUseCases()
    .verifyUserPendingEmailInteractor(applicationContext, {
      clientConnectionId,
      token,
    });

  return {
    alertInfo: {
      message: 'DAWSON is updating your email. Please wait.',
      title: 'Updating email address',
    },
  };
};

export const setVerifyUserPendingEmailNotificationAction = ({
  props,
  store,
}: ActionProps<{ messageType: VerifyEmailNotificationType }>) => {
  const { messageType } = props;
  store.unset(state.alertWarning);
  store.unset(state.alertSuccess);
  store.unset(state.alertInfo);

  const KEY = alertKeyDictionary[messageType] || 'alertWarning';
  const MESSAGE = alertDictionary[messageType] || genericAlertError;
  store.set(state[KEY], MESSAGE);
};
