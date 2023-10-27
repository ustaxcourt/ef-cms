import { state } from '@web-client/presenter/app.cerebral';

export const openSelectedTrialSessionPaperServicePdfAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const selectedPdf = get(state.modal.form.selectedPdf);
  const { url } = await applicationContext
    .getUseCases()
    .getPaperServicePdfUrlInteractor(applicationContext, {
      fileId: selectedPdf,
    });

  await applicationContext.getUtilities().openUrlInNewTab({ url });
};
