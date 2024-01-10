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

    // 10007 TODO: make path.success
    return path.yes({
      alertSuccess: {
        message:
          'Your email address is verified. You can now sign in to DAWSON.',
        title: 'Email address verified',
      },
    });
  } catch (e) {
    // 10007 TODO: make path.error
    return path.no({
      alertError: {
        message: 'Error confirming account',
      },
    });
  }
};
