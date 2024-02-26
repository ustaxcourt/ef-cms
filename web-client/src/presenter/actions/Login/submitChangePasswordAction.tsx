import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const submitChangePasswordAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps): Promise<{
  accessToken: string;
  idToken: string;
  refreshToken: string;
}> => {
  const { code, confirmPassword, email, password } = get(
    state.authentication.form,
  );
  const { tempPassword } = get(state.authentication);

  try {
    const { accessToken, idToken, refreshToken } = await applicationContext
      .getUseCases()
      .changePasswordInteractor(applicationContext, {
        code,
        confirmPassword,
        email,
        password,
        tempPassword,
      });

    return path.success({ accessToken, idToken, refreshToken });
  } catch (err: any) {
    const originalErrorMessage = err?.originalError?.response?.data;

    if (originalErrorMessage === 'User is unconfirmed') {
      return path.unconfirmedAccount({
        alertError: {
          message: (
            <>
              The email address is associated with an account but is not
              verified. We sent an email with a link to verify the email
              address. If you don’t see it, check your spam folder. If you’re
              still having trouble, email{' '}
              <a href="mailto:dawson.support@ustaxcourt.gov">
                dawson.support@ustaxcourt.gov
              </a>
              .
            </>
          ),
          title: 'Email address not verified',
        },
      });
    }
    if (
      originalErrorMessage === 'Forgot password code is expired or incorrect'
    ) {
      return path.error({
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
    }

    return path.error({
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
  }
};
