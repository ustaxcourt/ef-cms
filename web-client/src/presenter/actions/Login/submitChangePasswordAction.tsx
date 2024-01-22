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
  // TODO: move userEmail and session off form.state

  //TODO: validate entity here
  const { confirmPassword, password } = get(state.authentication.form);
  const { code, tempPassword, userEmail } = get(state.authentication);

  try {
    const { accessToken, idToken, refreshToken } = await applicationContext
      .getUseCases()
      .changePasswordInteractor(applicationContext, {
        code,
        confirmPassword,
        password,
        tempPassword,
        userEmail,
      });

    return path.success({ accessToken, idToken, refreshToken });
  } catch (err: any) {
    const originalErrorMessage = err?.originalError?.response?.data;

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
