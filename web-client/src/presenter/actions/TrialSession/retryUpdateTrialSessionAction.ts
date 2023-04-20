export const retryUpdateTrialSessionAction = async ({
  applicationContext,
  props,
}) => {
  await applicationContext.getUtilities().sleep(props.retryAfter || 3000);

  await applicationContext
    .getUseCases()
    .updateTrialSessionInteractor(applicationContext, props.originalRequest);
};
