export const openSelectedTrialSessionPaperServicePdfAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { selectedPdf } = props;
  const { url } = await applicationContext
    .getUseCases()
    .getPaperServicePdfUrlInteractor(applicationContext, {
      fileId: selectedPdf,
    });

  await applicationContext.getUtilities().openUrlInNewTab({ url });
};
