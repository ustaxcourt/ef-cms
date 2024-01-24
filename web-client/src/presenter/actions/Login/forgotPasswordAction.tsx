import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const forgotPasswordAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { email } = get(state.authentication.form);

  try {
    await applicationContext
      .getUseCases()
      .forgotPasswordInteractor(applicationContext, { email });

    return path.success({
      alertSuccess: {
        message: (
          <>
            If there is a DAWSON account for {email}, we’ll send a password
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
  } catch (err: any) {
    const originalErrorMessage = err?.originalError?.response?.data;

    if (originalErrorMessage === 'User is unconfirmed') {
      return path.unconfirmedAccount({
        alertWarning: {
          message: (
            <>
              We sent you an email to help you log in. If you don’t see it,
              check your spam folder. If you’re still having trouble, email{' '}
              <a href="mailto:dawson.support@ustaxcourt.gov">
                dawson.support@ustaxcourt.gov
              </a>
              .
            </>
          ),
          title: 'We’ve sent you an email',
        },
      });
    }

    // TODO 10007: are we sure we want to just throw an error when the error is not `User is unconfirmed`?
    throw err;
  }
};
