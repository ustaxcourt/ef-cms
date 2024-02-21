import { state } from '@web-client/presenter/app.cerebral';

export const uploadDocketEntryFileAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps) => {
  const docketEntryId = get(state.docketEntryId);
  const { uploadProgressCallbackMap } = props;
  try {
    const primaryDocumentFileId = await applicationContext
      .getUseCases()
      .uploadDocumentInteractor(applicationContext, {
        documentFile: uploadProgressCallbackMap.primary.file,
        key: docketEntryId,
        onUploadProgress: uploadProgressCallbackMap.primary.onUploadProgress,
      });

    return path.success({
      docketEntryId: primaryDocumentFileId,
    });
  } catch (err) {
    return path.error();
  }
};
