export const retryAddPaperFilingAction = async ({
  applicationContext,
  props,
}) => {
  await applicationContext.getUtilities().sleep(props.retryAfter || 3000);

  await applicationContext
    .getUseCases()
    .addPaperFilingInteractor(applicationContext, props.originalRequest);
};
