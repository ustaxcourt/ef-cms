export const retryUpdateUserContactInformationAction = async ({
  applicationContext,
  props,
}) => {
  await applicationContext.getUtilities().sleep(props.retryAfter || 3000);

  await applicationContext
    .getUseCases()
    .updateUserContactInformationInteractor(
      applicationContext,
      props.originalRequest,
    );
};
