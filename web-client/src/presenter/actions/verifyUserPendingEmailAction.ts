export const verifyUserPendingEmailAction = async ({
  applicationContext,
  path,
  props,
}: ActionProps) => {
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
          'Your email address is verified. You can now sign in to DAWSON.',
        title: 'Email address verified',
      },
    });
  } catch (e: any) {
    return path.error({
      alertError: {
        message:
          'An unexpected error occurred. Could not verify e-mail address. Please contact DAWSON support if this continues.',
        title: 'Unable to verify e-mail address',
      },
    });
  }
};
