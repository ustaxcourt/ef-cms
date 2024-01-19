export const confirmSignUpAction = async ({
  applicationContext,
  path,
  props,
}: ActionProps<{
  confirmationCode: string;
  userId: string;
  email: string;
}>) => {
  const { confirmationCode, email, userId } = props;

  try {
    await applicationContext
      .getUseCases()
      .confirmSignUpInteractor(applicationContext, {
        confirmationCode,
        email,
        userId,
      });

    return path.success({
      alertSuccess: {
        message:
          'Your email address is verified. You can now sign in to DAWSON.',
        title: 'Email address verified',
      },
    });
  } catch (e) {
    return path.error({
      alertError: {
        message:
          'Enter your email address and password below, then log in to be sent a new verification email.',
        title: 'Verification email link expired',
      },
    });
  }
};
