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
};
