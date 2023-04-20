export const retrySetNoticesForCalendaredTrialSessionAction = async ({
  applicationContext,
  props,
}) => {
  await applicationContext.getUtilities().sleep(props.retryAfter || 3000);

  await applicationContext
    .getUseCases()
    .setNoticesForCalendaredTrialSessionInteractor(
      applicationContext,
      props.originalRequest,
    );
};
