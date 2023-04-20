export const retryVerifyUserPendingEmailAction = async ({
  applicationContext,
  props,
}) => {
  await applicationContext.getUtilities().sleep(props.retryAfter || 3000);

  await applicationContext
    .getUseCases()
    .verifyUserPendingEmailInteractor(
      applicationContext,
      props.originalRequest,
    );
};
