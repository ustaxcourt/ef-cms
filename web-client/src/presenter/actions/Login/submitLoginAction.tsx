import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const submitLoginAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps): Promise<{
  accessToken: string;
  idToken: string;
  refreshToken: string;
}> => {
  const { email, password } = get(state.authentication.form);

  try {
    const { accessToken, idToken, refreshToken } = await applicationContext
      .getUseCases()
      .loginInteractor(applicationContext, {
        email: email.toLowerCase(),
        password,
      });

    return path.success({ accessToken, idToken, refreshToken });
  } catch (err: any) {
    const originalErrorMessage = err?.originalError?.response?.data;

    if (originalErrorMessage === 'NewPasswordRequired') {
      return path.changePassword({ email, tempPassword: password });
    }

    if (originalErrorMessage === 'Invalid Username or Password') {
      return path.error({
        alertError: {
          message: 'The email address or password you entered is invalid.',
          title: 'Please correct the following errors:',
        },
      });
    }
    if (originalErrorMessage === 'Password attempts exceeded') {
      return path.error({
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
    }

    if (originalErrorMessage === 'User temporary password expired') {
      return path.error({
        alertError: {
          message: (
            <>
              The temporary password you entered has expired. We sent an email
              with a new temporary password that expires in 7 days. If you don’t
              see it, check your spam folder. If you’re still having trouble,
              email{' '}
              <a href="mailto:dawson.support@ustaxcourt.gov">
                dawson.support@ustaxcourt.gov
              </a>
              .
            </>
          ),
          title: 'Temporary password has expired',
        },
      });
    }

    if (originalErrorMessage === 'User is unconfirmed') {
      return path.error({
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

    return path.error({
      alertError: {
        title:
          'There was an unexpected error when logging in. Please try again.',
      },
    });
  }
};
