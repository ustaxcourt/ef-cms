export const openMessageAttachmentDocumentAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { documentId, docketNumber } = props;
  let url;
  try {
    ({ url } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor(applicationContext, {
        docketNumber,
        key: documentId,
      }));
  } catch (err: any) {
    throw new Error(`Unable to open attachment. ${err.message}`);
  }
  applicationContext.getUtilities().openUrlInNewTab({ url });
};
