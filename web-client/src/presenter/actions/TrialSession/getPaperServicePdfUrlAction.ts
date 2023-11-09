export const getPaperServicePdfUrlAction = async ({
  applicationContext,
  props,
}: ActionProps<{ fileId: string }>): Promise<{ pdfUrl: string }> => {
  const { url: pdfUrl } = await applicationContext
    .getUseCases()
    .getPaperServicePdfUrlInteractor(applicationContext, {
      fileId: props.fileId,
    });

  return { pdfUrl };
};
