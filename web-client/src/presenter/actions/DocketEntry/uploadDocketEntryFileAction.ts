import { state } from '@web-client/presenter/app.cerebral';

export const uploadDocketEntryFileAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps) => {
  const docketEntryId = get(state.docketEntryId);
  const { primaryDocumentFile, uploadProgressCallbackMap } = props;

  try {
    const primaryDocumentFileId = await applicationContext
      .getUseCases()
      .uploadDocumentInteractor(applicationContext, {
        documentFile: primaryDocumentFile,
        key: docketEntryId,
        onUploadProgress: uploadProgressCallbackMap.primary,
      });

    return path.success({
      docketEntryId: primaryDocumentFileId,
    });
  } catch (err) {
    return path.error();
  }
};
