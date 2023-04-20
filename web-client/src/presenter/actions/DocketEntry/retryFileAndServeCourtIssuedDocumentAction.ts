export const retryFileAndServeCourtIssuedDocumentAction = async ({
  applicationContext,
  props,
}) => {
  await applicationContext.getUtilities().sleep(props.retryAfter || 3000);

  await applicationContext
    .getUseCases()
    .fileAndServeCourtIssuedDocumentInteractor(
      applicationContext,
      props.originalRequest,
    );
};
