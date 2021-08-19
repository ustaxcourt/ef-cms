export const verifyUserPendingEmailAction = async ({
  applicationContext,
  props,
}) => {
  const { token } = props;

  await applicationContext
    .getUseCases()
    .verifyUserPendingEmailInteractor(applicationContext, {
      token,
    });
};
