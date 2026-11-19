export const openMessageAttachmentDocumentAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { documentId, docketNumber, isPublic } = props;

  let url;
  try {
    ({ url } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor(applicationContext, {
        docketNumber,
        isPublic,
        key: documentId,
      }));
  } catch (err: any) {
    throw new Error(`Unable to open document. ${err.message}`);
  }

  applicationContext.getUtilities().openUrlInNewTab({ url });
};
