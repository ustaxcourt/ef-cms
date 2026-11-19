import { state } from '@web-client/presenter/app.cerebral';

export const openMessageAttachmentDocumentAction = async ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  const { documentId, docketNumber, isPublic } = props;

  let url;
  try {
    ({ url } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor(applicationContext, {
        docketNumber,
        isPublic,
        key: docketEntryId,
      }));
  } catch (err: any) {
    throw new Error(`Unable to open document. ${err.message}`);
  }

  applicationContext.getUtilities().openUrlInNewTab({ url });
};
