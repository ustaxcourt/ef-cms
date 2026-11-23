export const openMessageAttachmentDocumentAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { documentId, docketNumber, isPublic } = props;

  const { url } = await applicationContext
    .getUseCases()
    .getDocumentDownloadUrlInteractor(applicationContext, {
      docketNumber,
      isPublic,
      key: documentId,
    });

  applicationContext.getUtilities().openUrlInNewTab({ url });
};
