import { state } from '@web-client/presenter/app.cerebral';

export const submitLoginAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps): Promise<{
  accessToken: string;
  idToken: string;
  refreshToken: string;
}> => {
  const { email, password } = get(state.form);

  try {
    const { accessToken, idToken, refreshToken } = await applicationContext
      .getUseCases()
      .loginInteractor(applicationContext, { email, password });

    return path.success({ accessToken, idToken, refreshToken });
  } catch (err: any) {
    if (err.responseCode === 401) {
      return path.error({
        alertError: {
          message: 'The email address or password you entered is invalid.',
          title: 'Please correct the following errors:',
        },
      });
    }

    if (err.responseCode === 403) {
      return path.error({
        alertError: {
          message:
            'The email address is associated with an account but is not verified. We sent an email with a link to verify the email address. If you don’t see it, check your spam folder. If you’re still having trouble, email dawson.support@ustaxcourt.gov.',
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
