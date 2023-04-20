export const retryEditPaperFilingAction = async ({
  applicationContext,
  props,
}) => {
  await applicationContext.getUtilities().sleep(props.retryAfter || 3000);

  await applicationContext
    .getUseCases()
    .editPaperFilingInteractor(applicationContext, props.originalRequest);
};
