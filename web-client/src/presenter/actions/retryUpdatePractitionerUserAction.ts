export const retryUpdatePractitionerUserAction = async ({
  applicationContext,
  props,
}) => {
  await applicationContext.getUtilities().sleep(props.retryAfter || 3000);

  await applicationContext
    .getUseCases()
    .updatePractitionerUserInteractor(
      applicationContext,
      props.originalRequest,
    );
};
