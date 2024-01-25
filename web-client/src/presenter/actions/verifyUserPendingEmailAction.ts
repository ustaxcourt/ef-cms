export const verifyUserPendingEmailAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { token } = props;

  await applicationContext
    .getUseCases()
    .verifyUserPendingEmailInteractor(applicationContext, {
      token,
    });

  return {
    alertSuccess: {
      message: 'Your email address is verified. You can now sign in to DAWSON.',
      title: 'Email address verified',
    },
  };
};
