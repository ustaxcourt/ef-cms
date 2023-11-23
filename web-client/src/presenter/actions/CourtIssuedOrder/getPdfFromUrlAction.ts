export const getPdfFromUrlAction = async ({
  applicationContext,
  props,
}: ActionProps<{
  pdfUrl: string;
}>): Promise<{
  pdfFile: any;
}> => {
  return await applicationContext
    .getUseCases()
    .getPdfFromUrlInteractor(applicationContext, { pdfUrl: props.pdfUrl });
};
